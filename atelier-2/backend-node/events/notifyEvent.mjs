import {CONNECTED_USERS_HASH, NOTIFY_ROOM_FIGHT_CREATED_EVENT} from "../utils/constants.mjs";
import {json} from "express";


/**
 * Met à jour la liste des utilisateurs connectés en temps réel.
 *
 * @function updateConnectedUsers
 * @async
 * @param {Object} io - Instance de Socket.IO pour émettre des événements.
 * @param {Object} redis - Instance de Redis pour récupérer les données des utilisateurs connectés.
 * @throws {Error} Si une erreur survient lors de la récupération ou du traitement des utilisateurs connectés.
 */
export const updateConnectedUsers = async (io, redis) => {
    try {
        const connectedUsers = await redis.hgetall(CONNECTED_USERS_HASH);
        try {
            const usersList = Object.values(connectedUsers).map(user => JSON.parse(user));

            io.emit("updateConnectedUsers", usersList);
        } catch (error) {
            console.error("Error parsing or emitting connected users list:", error.message);
        }
    } catch (error) {
        console.error("Error retrieving connected users from Redis:", error.message);
    }
};

/**
 * Notifie un utilisateur d’un historique de conversation.
 *
 * @function notifyConversationHistory
 * @async
 * @param {Object} io - Instance de Socket.IO pour émettre des événements (non utilisé ici, mais inclus pour cohérence).
 * @param {Object} userSocket - Instance de Socket.IO associée à l'utilisateur.
 * @param {Array} messages - Liste des messages historiques à transmettre.
 * @throws {Error} Si une erreur survient lors de l'émission de l'événement.
 */
export const notifyConversationHistory = async (io, userSocket, messages) => {
    try {
        userSocket.emit("notifyConversationHistory", messages);
    } catch (error) {
        console.error("Error notifying conversation history:", error.message);
    }
};
export const notifyUser = async (io, userSocket , event, message) => {
    // Envoi à tous les clients connectés
    userSocket.emit(event, message);
    console.log(`Notification socket, event: ${event}, message: ${message}`);
}

export const notifyRoom = (io, roomId, event, message) => {
    io.to(roomId).emit(event,message);
    console.log(`Notification de la room : ${roomId}, event: ${event}`);
}

/**
 * Notifie un utilisateur d'un nouveau message reçu.
 *
 * @function notifyNewMessage
 * @param {Object} socketUser - Instance de Socket.IO associée à l'utilisateur destinataire.
 * @param {number} fromId - ID de l'expéditeur du message (type long, équivalent à un entier 64 bits).
 * @param {string} fromUsername - Nom d'utilisateur de l'expéditeur.
 * @param {string} content - Contenu du message envoyé.
 * @param {Date} time - Horodatage du message.
 * @throws {Error} Si une erreur survient lors de l'émission de l'événement.
 */
export const notifyNewMessage = (socketUser, fromId, fromUsername, content, time) => {
    try {
        socketUser.emit('newMessage', {
            from: { id: fromId, username: fromUsername },
            content,
            time
        });
    } catch (error) {
        console.error(`Error notifying new message to user ${fromUsername}:`, error.message);
    }
};
