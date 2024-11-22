import {
    NOTIFY_NOT_ENOUGH_CARD_EVENT,
    NOTIFY_ROOM_FIGHT_CREATED_EVENT, NOTIFY_ROOM_PLAY_ERROR,
    TYPE_ROOM,
    WAITLIST_FIGHT_HASH
} from "../utils/constants.mjs";
import {notifyRoom, notifyUser} from "./notifyEvent.mjs";
import {createRoom} from "../utils/roomUtils.mjs";
import {UserRepository} from "../repository/UserRepository.mjs";
import {GameRepository} from "../repository/GameRepository.mjs";
import { GameModel } from "../RedisModel/GameModel.mjs";
import {getDetailsUserById} from "../utils/redisUtils.mjs";

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

        // Initialisation du retryFlag dans Redis
        const retryFlagKey = `retryFlag:${id}`;
        await redis.set(retryFlagKey, true); // Mise à true par défaut

        let listLength = await redis.llen(WAITLIST_FIGHT_HASH);

        while (listLength < 2) {
            // Vérifier si le retryFlag est toujours actif
            const retryFlag = await redis.get(retryFlagKey);

            if (retryFlag !== 'true') {
                console.log(`Le retryFlag pour l'utilisateur ${id} est passé à false. Arrêt de la boucle.`);
                return; // Sortir de la fonction si retryFlag est désactivé
            }

            console.log("Moins de deux joueurs dans la liste d'attente. Nouvelle tentative dans 500ms...");
            await new Promise(resolve => setTimeout(resolve, 500)); // Attente de 500ms
            listLength = await redis.llen(WAITLIST_FIGHT_HASH);
        }

        console.log(`L'utilisateur ${id} possède bien au moins 5 cartes : ${cards.length}`);
        await redis.rpush(WAITLIST_FIGHT_HASH, id);

        console.log(`Ajout de l'utilisateur ${id} dans la liste d'attente`);
        console.log("Il y a au moins deux personnes dans la liste d'attente.");

        const firstTwo = await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1);
        const adversary = parseInt(firstTwo[0]) === data.id ? firstTwo[1] : parseInt(firstTwo[0]);

        console.log("mdr", adversary);

        await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1);

        console.log("Les deux premières personnes sont :", firstTwo);

        const detailsUser1 = await getDetailsUserById(redis, firstTwo[0]);
        const detailsUser2 = await getDetailsUserById(redis, firstTwo[1]);

        console.log(`detailsUser1 : ${detailsUser1}`);
        console.log(`detailsUser2 : ${detailsUser2}`);

        const userSocket1 = await io.in(detailsUser1.socketId).fetchSockets();
        const userSocket2 = await io.in(detailsUser2.socketId).fetchSockets();

        console.log(`userSocket1 : ${userSocket1}`);

        const roomId = createRoom(io, TYPE_ROOM.FIGHT, firstTwo[0], firstTwo[1], userSocket1, userSocket2);

        const randomIndex = Math.floor(Math.random() * firstTwo.length);
        const gameMaster = firstTwo[randomIndex];

        console.log(`Le game master est l'utilisateur : ${gameMaster}`);

        const userId1 = Math.min(firstTwo[0], firstTwo[1]);
        const userId2 = Math.max(firstTwo[0], firstTwo[1]);

        const gameCreationRequest = {
            user1Id: userId1,
            user2Id: userId2,
        };

        await gameRepository.createGame(gameCreationRequest)
            .then(createdGame => {
                console.log("Id de la game : " + JSON.stringify(createdGame));
                notifyRoom(io, roomId, NOTIFY_ROOM_FIGHT_CREATED_EVENT, {
                    'gameId': createdGame,
                });
            })
            .catch(error => console.error('Error creating game:' + error));
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}
