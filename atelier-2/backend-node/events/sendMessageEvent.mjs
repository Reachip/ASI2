import { CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH } from "../utils/constants.mjs";
import { existsInRedis, getListFromRedis } from "../utils/redisUtils.mjs";
import SaveMessageActiveMq from "../activemq/SaveMessageActiveMQ.mjs";
import { notifyNewMessage } from "./notifyEvent.mjs";

const saveMessageInstance = new SaveMessageActiveMq();

/**
 * Gère l'événement d'envoi de message, en distinguant les messages destinés au chat global et ceux destinés à des utilisateurs spécifiques.
 *
 * @function sendMessageEvent
 * @async
 * @param {Object} redis - Instance de Redis utilisée pour les vérifications de données.
 * @param {Object} io - Instance de Socket.IO pour émettre des événements.
 * @param {Object} socket - Socket.IO du client émetteur.
 * @param {Object} data - Données du message à envoyer.
 * @param {Object} data.from - Informations sur l'émetteur du message.
 * @param {number} data.from.id - ID de l'émetteur.
 * @param {string} data.from.username - Nom d'utilisateur de l'émetteur.
 * @param {number} data.to - ID du destinataire (0 pour le chat global).
 * @param {string} data.content - Contenu du message.
 * @param {Date} data.time - Horodatage du message.
 * @throws {Error} Si une erreur survient lors de l'envoi ou de la sauvegarde du message.
 */
const sendMessageEvent = async (redis, io, socket, data) => {
    const { from, to, content, time } = data;
    console.log(`sendMessageEvent: from: ${JSON.stringify(from)}; to: ${to}; content: ${content}; time: ${time}`);

    try {
        if (to == 0) {
            console.log(`Message to be sent to all users.`);

            try {
                io.to("chat_room_global").emit("newMessage", {
                    from: { id: from.id, username: from.username },
                    content,
                    time
                });
                console.log(`Message sent to the global chat room.`);
            } catch (error) {
                console.error("Error sending message to global chat room:", error.message);
            }

            try {
                await saveMessage(from.id, from.username, 0, 0, content, time);
                console.log(`Global message saved successfully.`);
            } catch (error) {
                console.error("Error saving global message:", error.message);
            }
        } else {
            const roomId = `chat_room_${Math.min(from.id, to)}_${Math.max(from.id, to)}`;

            try {
                if (await existsInRedis(redis, USER_ROOMS_HASH, from.id, roomId)) {
                    io.to(roomId).emit("newMessage", {
                        from: { id: from.id, username: from.username },
                        content,
                        time
                    });
                    console.log(`Message sent to room ${roomId}.`);
                } else {
                    notifyNewMessage(socket, from.id, from.username, content, time);
                    console.log(`Message sent directly to user ${to}.`);
                }
            } catch (error) {
                console.error(`Error sending message to room ${roomId} or user ${to}:`, error.message);
            }

            try {
                await saveMessage(from.id, from.username, to, to, content, time);
                console.log(`Message to ${to} saved successfully.`);
            } catch (error) {
                console.error("Error saving message to specific user:", error.message);
            }
        }
    } catch (error) {
        console.error("Error in sendMessageEvent:", error.message);
    }
};

/**
 * Sauvegarde un message via ActiveMQ.
 *
 * @function saveMessage
 * @async
 * @param {number} fromId - ID de l'émetteur du message.
 * @param {string} fromUsername - Nom d'utilisateur de l'émetteur.
 * @param {number} toId - ID du destinataire.
 * @param {string} toUsername - Nom d'utilisateur du destinataire.
 * @param {string} content - Contenu du message.
 * @param {Date} time - Horodatage du message.
 * @throws {Error} Si une erreur survient lors de la sauvegarde via ActiveMQ.
 */
const saveMessage = async (fromId, fromUsername, toId, toUsername, content, time) => {
    const message = {
        fromId: fromId,
        fromUsername: fromUsername,
        toId: toId,
        toUsername: toUsername,
        content: content,
        time: time
    };

    try {
        console.log("Message before sending:", JSON.stringify(message));
        await saveMessageInstance.sendMessage(message);
        console.log("Message saved successfully via ActiveMQ.");
    } catch (error) {
        console.error("Error saving message via ActiveMQ:", error.message);
        throw error;
    }
};

export default sendMessageEvent;