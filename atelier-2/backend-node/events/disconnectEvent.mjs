import { deleteInRedis, getListFromRedis, logDetailsRedis } from "../utils/redisUtils.mjs";
import { updateConnectedUsers } from "./notifyEvent.mjs";
import { deleteRoom } from "../utils/roomUtils.mjs";
import { CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH } from "../utils/constants.mjs";
import RetryPlayQueue from "../service/RetryPlayQueue.mjs";

/**
 * Gère la déconnexion d'un utilisateur et effectue les nettoyages nécessaires.
 *
 * @function disconnectEvent
 * @async
 * @param {Object} redis - Instance de Redis pour la gestion des connexions et des relations.
 * @param {Object} io - Instance de Socket.IO pour interagir avec les salles et notifier les utilisateurs.
 * @param {string} socketId - Identifiant du socket de l'utilisateur déconnecté.
 * @param {number} id - ID de l'utilisateur déconnecté.
 * @param {string} username - Nom d'utilisateur de l'utilisateur déconnecté.
 * @throws {Error} Si une erreur survient lors du traitement de la déconnexion.
 */
const disconnectEvent = async (redis, io, socketId, id, username) => {
    console.log("User disconnected:", id, username, socketId);

    const retryPlayQueue = new RetryPlayQueue(redis, id)
    await retryPlayQueue.delete()

    try {
        try {
            await redis.hdel(CONNECTED_USERS_HASH, id);
            console.log(`User ${id} removed from connected users.`);
        } catch (error) {
            console.error("Error removing user from Redis connected users:", error.message);
        }

        let rooms = [];
        try {
            rooms = await getListFromRedis(redis, USER_ROOMS_HASH, id);
            console.log(`User ${id} was connected to rooms:`, rooms);
        } catch (error) {
            console.error("Error retrieving rooms from Redis:", error.message);
        }

        for (const room of rooms) {
            try {
                if (room.includes("chat_room")) {
                    const match = room.match(/^chat_room_(\d+)_(\d+)$/);
                    if (match) {
                        const id1 = match[1];
                        const id2 = match[2];
                        const otherId = id1 === id.toString() ? id2 : id1;

                        try {
                            await deleteInRedis(redis, SELECTED_USER_HASH, id, otherId);
                            await deleteInRedis(redis, SELECTED_USER_HASH, otherId, id);
                            console.log(`Removed selection relationship between ${id} and ${otherId}.`);
                        } catch (error) {
                            console.error(`Error removing selection relationship between ${id} and ${otherId}:`, error.message);
                        }

                        try {
                            await deleteInRedis(redis, USER_ROOMS_HASH, id, room);
                            await deleteInRedis(redis, USER_ROOMS_HASH, otherId, room);
                            console.log(`Removed room relationship ${room} between ${id} and ${otherId}.`);
                        } catch (error) {
                            console.error(`Error removing room relationship for room ${room}:`, error.message);
                        }
                    }
                }

                try {
                    deleteRoom(io, room);
                    console.log(`Room ${room} deleted.`);
                } catch (error) {
                    console.error(`Error deleting room ${room}:`, error.message);
                }
            } catch (error) {
                console.error("Error processing room:", error.message);
            }
        }

        try {
            await logDetailsRedis(io, redis);
            console.log("Logged Redis details successfully.");
        } catch (error) {
            console.error("Error logging Redis details:", error.message);
        }

        try {
            await updateConnectedUsers(io, redis);
            console.log("Updated connected users successfully.");
        } catch (error) {
            console.error("Error updating connected users:", error.message);
        }
    } catch (error) {
        console.error("Error in disconnectEvent:", error.message);
    }
};

export default disconnectEvent;