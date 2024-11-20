import axios from "axios";
import {
    NOTIFY_NOT_ENOUGH_CARD_EVENT,
    NOTIFY_ROOM_FIGHT_CREATED_EVENT,
    TYPE_ROOM,
    WAITLIST_FIGHT_HASH
} from "../utils/constants.mjs";
import {notifyRoom, notifyUser} from "./notifyEvent.mjs";
import {getDetailsUserById} from "../utils/redisUtils.mjs";
import {createRoom} from "../utils/roomUtils.mjs";

export const playEvent = async (redis, io, userId, userSocket) => {
    try {

        const response = await axios.get(`http://localhost:8080/api/user/${userId}/cards`);
        const listCards = response.data.cardList;
        console.log(`Liste des cartes de l'utilisateur (${userId} récupéré :`,listCards);

        const nbCard = listCards.length;
        if (nbCard >= 5){
            console.log(`L'utilisateur ${userId} possede bien au moins 5 cartes : ${nbCard}`)
            await redis.rpush(WAITLIST_FIGHT_HASH, userId);
            console.log(`Ajout de l'utilisateur ${userId} dans la liste d'attente`)

            const listLength = await redis.llen(WAITLIST_FIGHT_HASH);
            if (listLength >= 2) {
                console.log("Il y a au moins deux personnes dans la liste d'attente.");

                const firstTwo = await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1);
                await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1); // Supprime les deux premiers
                console.log("Les deux premières personnes sont :", firstTwo);

                const userSocket1 = await io.sockets.sockets.get(firstTwo[0]);
                const userSocket2 = await  io.sockets.sockets.get(firstTwo[1]);

                const roomId = createRoom(io,TYPE_ROOM.FIGHT,firstTwo[0],firstTwo[1], userSocket1, userSocket2);

                const randomIndex = Math.floor(Math.random() * firstTwo.length);
                const gameMaster = firstTwo[randomIndex];

                console.log(`Le game master est l'utilisateur : ${gameMaster}`);

                notifyRoom(io,roomId,NOTIFY_ROOM_FIGHT_CREATED_EVENT,gameMaster);

            } else {
                console.log("Il y a moins de deux personnes dans la liste d'attente.");
            }

        }
        else {
            console.log(`L'utilisateur ${userId} ne possede pas au moins 5 cartes : ${nbCard}`)

            await notifyUser(io, userSocket, NOTIFY_NOT_ENOUGH_CARD_EVENT, "");
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}