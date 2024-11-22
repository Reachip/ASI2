import {
    NOTIFY_NOT_ENOUGH_CARD_EVENT,
    NOTIFY_ROOM_FIGHT_CREATED_EVENT,
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
        console.warn("cards =", cards)

        const listCards = await userRepository.getUserCards(id);
        console.log(`Liste des cartes de l'utilisateur (${id} récupéré :`, listCards);

        const listLength = await redis.llen(WAITLIST_FIGHT_HASH);
        const nbCard = listCards.length;

        if (nbCard >= 5 && listLength >= 2) {
            console.log(`L'utilisateur ${id} possède bien au moins 5 cartes : ${nbCard}`)
            await redis.rpush(WAITLIST_FIGHT_HASH, );

            console.log(`Ajout de l'utilisateur ${id} dans la liste d'attente`);
            console.log("Il y a au moins deux personnes dans la liste d'attente.");

            const firstTwo = await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1);
            const adversaryId = parseInt(firstTwo[0]) === data.id ? firstTwo[1] : parseInt(firstTwo[0])
            console.log("adversaryId id :", adversaryId)

            await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1);
            console.log("Les deux premières personnes sont :", firstTwo);

            const detailsAdversary = await getDetailsUserById(redis, adversaryId);
            console.log(`detailsAdversary : ${detailsAdversary}`);

            const userSocket = await io.in(detailsAdversary.socketId).fetchSockets();
            console.log(`userSocket : ${userSocket}`);
            const adversarySocket = await io.in(detailsAdversary.socketId).fetchSockets();
            console.log(`adversarySocket : ${adversarySocket}`);

            const roomId = createRoom(io, TYPE_ROOM.FIGHT, id, adversaryId, userSocket, adversarySocket);

            const userId1 = Math.min(id, adversaryId);
            const userId2 =  Math.max(id, adversaryId);

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

                    new GameModel(createdGame, 100, userId1 , userId2);

                })
                .catch(error => console.error('Error creating game:' + error));
        } else {
            console.log("Il y a moins de deux personnes dans la liste d'attente ou l'utilisateur n'a pas assez de cartes.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}