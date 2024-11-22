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

export const playEvent = async (redis, io, id, userSocket) => {
    try {
        const listCards = await userRepository.getUserCards(id);
        console.log(`Liste des cartes de l'utilisateur (${id} récupéré :`, listCards);

        const nbCard = listCards.length;
        if (nbCard >= 5){
            console.log(`L'utilisateur ${id} possède bien au moins 5 cartes : ${nbCard}`)
            await redis.rpush(WAITLIST_FIGHT_HASH, id);
            console.log(`Ajout de l'utilisateur ${id} dans la liste d'attente`);

            const listLength = await redis.llen(WAITLIST_FIGHT_HASH);
            if (listLength >= 2) {
                console.log("Il y a au moins deux personnes dans la liste d'attente.");

                const firstTwo = await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1);
                await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1); // Supprime les deux premiers
                console.log("Les deux premières personnes sont :", firstTwo);

                const detailsUser1 = await getDetailsUserById(redis, firstTwo[0]);
                const detailsUser2 = await getDetailsUserById(redis, firstTwo[1]);

                console.log(`detailsUser1 : ${detailsUser1}`);
                console.log(`detailsUser2 : ${detailsUser2}`);

                const userSocket1 = await io.in(detailsUser1.socketId).fetchSockets();
                const userSocket2 = await io.in(detailsUser2.socketId).fetchSockets();

                console.log(`userSocket1 : ${userSocket1}`);

                const roomId = createRoom(io,TYPE_ROOM.FIGHT,firstTwo[0],firstTwo[1], userSocket1, userSocket2);

                const randomIndex = Math.floor(Math.random() * firstTwo.length);
                const gameMaster = firstTwo[randomIndex];

                console.log(`Le game master est l'utilisateur : ${gameMaster}`);
                const userId1 = Math.min(firstTwo[0], firstTwo[1]);
                const userId2 =  Math.max(firstTwo[0], firstTwo[1]);

                const gameCreationRequest = {
                    user1Id: userId1,
                    user2Id: userId2,
                };

                await gameRepository.createGame(gameCreationRequest)
                    .then(createdGame =>{
                        console.log("Id de la game : "+JSON.stringify(createdGame));
                        notifyRoom(io,roomId,NOTIFY_ROOM_FIGHT_CREATED_EVENT,{'gameMaster': parseInt(gameMaster), 'gameId':createdGame});
                    })
                    .catch(error => console.error('Error creating game:'+error));

            } else {
                console.log("Il y a moins de deux personnes dans la liste d'attente.");
            }

        }
        else {
            console.log(`L'utilisateur ${id} ne possede pas au moins 5 cartes : ${nbCard}`)

            await notifyUser(io, userSocket, NOTIFY_NOT_ENOUGH_CARD_EVENT, "");
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}