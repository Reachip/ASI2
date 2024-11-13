import {deleteInRedis, getListFromRedis, logDetailsRedis} from "../utils/redisUtils.mjs";
import {updateConnectedUsers} from "./notifyEvent.mjs";
import {deleteRoom} from "../utils/roomUtils.mjs";
import {CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH} from "../utils/constants.mjs";

const disconnectEvent = async (redis, io, socketId, userId, username) => {
    console.log("Utilisateur déconnecté :", userId, username, socketId);

    //const socket = io.sockets.sockets.get(socketId);

    // Supprimer l'utilisateur des utilisateurs connectés
    await redis.hdel(CONNECTED_USERS_HASH, userId);

    // Récupère toutes les rooms auxquelles l'utilisateur était connecté
    const rooms = await getListFromRedis(redis, USER_ROOMS_HASH,userId);
    console.log("L'utilisateur était connecté aux rooms :", rooms);

    for (const room of rooms) {
        if (room.includes("chat_room")) {
            // Extraire les deux IDs d'utilisateur de la room
            const match = room.match(/^chat_room_(\d+)_(\d+)$/);
            if (match) {
                const id1 = match[1];
                const id2 = match[2];
                const otherUserId = id1 === userId.toString() ? id2 : id1;

                // Supprimer la relation d'utilisateur dans Redis
                await deleteInRedis(redis, SELECTED_USER_HASH, userId, otherUserId);
                await deleteInRedis(redis, SELECTED_USER_HASH, otherUserId, userId);
                console.log(`Suppression des relation de selection entre ${userId} et ${otherUserId}`);
                await deleteInRedis(redis, USER_ROOMS_HASH, userId, room);
                await deleteInRedis(redis, USER_ROOMS_HASH, otherUserId, room);
                console.log(`Suppression des relation de la room ${room} entre ${userId} et ${otherUserId}`);
            }
        }
        deleteRoom(io, room);
    }

    await logDetailsRedis(io,redis);

    await updateConnectedUsers(io,redis);
};

export default disconnectEvent;