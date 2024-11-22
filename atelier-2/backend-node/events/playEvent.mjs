import {
    NOTIFY_NOT_ENOUGH_CARD_EVENT,
    NOTIFY_ROOM_FIGHT_CREATED_EVENT, NOTIFY_ROOM_PLAY_CANCEL,
    TYPE_ROOM,
    WAITLIST_FIGHT_HASH
} from "../utils/constants.mjs";
import {notifyRoom, notifyUser} from "./notifyEvent.mjs";
import {createRoom} from "../utils/roomUtils.mjs";
import {UserRepository} from "../repository/UserRepository.mjs";
import {GameRepository} from "../repository/GameRepository.mjs";
import { GameModel } from "../RedisModel/GameModel.mjs";
import {getDetailsUserById} from "../utils/redisUtils.mjs";
import RetryPlayQueue from "../service/RetryPlayQueue.mjs";

const userRepository = new UserRepository();
const gameRepository = new GameRepository();

export const playEvent = async (redis, io, data) => {
    try {
        const { id, cards } = data;

        const listCards = await userRepository.getUserCards(id);
        console.log(`Liste des cartes de l'utilisateur (${id} récupérée :`, listCards);

        if (cards.length !== 5) {
            console.error("L'utilisateur doit pouvoir jouer avec cinq cartes");
            return;
        }

        if (!cards.every(userCard => listCards.map(card => card.id).includes(userCard))) {
            console.error("L'utilisateur ne peut pas jouer avec ces cartes");
            return;
        }

        const retryPlayQueue = new RetryPlayQueue(redis, id)
        await retryPlayQueue.init()

        await redis.rpush(WAITLIST_FIGHT_HASH, JSON.stringify(data));

        while (await redis.llen(WAITLIST_FIGHT_HASH) < 2) {
            const retryFlag = await retryPlayQueue.get()

            if (retryFlag !== 'true') {
                console.log(`Le retryFlag pour l'utilisateur ${id} est passé à false. Arrêt de la boucle.`);
                return;
            }

            console.log("Moins de deux joueurs dans la liste d'attente. Nouvelle tentative dans 500ms...");
            await new Promise(resolve => setTimeout(resolve, 500)); // Attente de 500ms
        }

        await retryPlayQueue.delete()

        console.log(`L'utilisateur ${id} possède bien au moins 5 cartes : ${cards.length}`);

        console.log("Il y a au moins deux personnes dans la liste d'attente.");

        const [firstPlayer, secondPlayer] = (await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1)).map(player => JSON.parse(player));
        await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1);

        console.log("Les deux premières personnes sont :", firstPlayer, secondPlayer);

        const detailsUser1 = await getDetailsUserById(redis, firstPlayer.id);
        const detailsUser2 = await getDetailsUserById(redis, secondPlayer.id);

        console.log(`detailsUser1 : ${detailsUser1}`);
        console.log(`detailsUser2 : ${detailsUser2}`);

        const userSocket1 = await io.in(detailsUser1.socketId).fetchSockets();
        const userSocket2 = await io.in(detailsUser2.socketId).fetchSockets();

        const roomId = createRoom(io, TYPE_ROOM.FIGHT, firstPlayer.id, secondPlayer.id, userSocket1, userSocket2);

        const randomIndex = Math.floor(Math.random() * 2);

        const [ userId1, userId2] = [Math.min(firstPlayer.id, secondPlayer.id), Math.max(firstPlayer.id, secondPlayer.id)];

        const gameCreationRequest = {user1Id: userId1, user2Id: userId2};

        await gameRepository.createGame(gameCreationRequest)
            .then(createdGame => {
                console.log("Id de la game : " + JSON.stringify(createdGame))

                const payload = {
                    'gameId': createdGame,
                    'player1': firstPlayer,
                    'player2': secondPlayer,
                }

                notifyRoom(io, roomId, NOTIFY_ROOM_FIGHT_CREATED_EVENT, payload);
            })
            .catch(error => console.error('Error creating game:' + error));
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}
