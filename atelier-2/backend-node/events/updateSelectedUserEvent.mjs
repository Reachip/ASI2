import {deleteRoom} from "../utils/roomUtils.mjs";
import {addInRedis, deleteInRedis, existsInRedis, logDetailsRedis} from "../utils/redisUtils.mjs";
import {NOTIFY_CONVERSATION_HISTORY_EVENT, SELECTED_USER_HASH, USER_ROOMS_HASH} from "../utils/constants.mjs";
import axios from 'axios';
import { notifyConversationHistory } from "./notifyEvent.mjs";
import {notifyUser} from "./notifyEvent.mjs";

/**
 * Met à jour l'utilisateur sélectionné par un utilisateur donné.
 *
 * @function updateSelectedUserEvent
 * @async
 * @param {Object} redis - Instance de Redis utilisée pour les interactions avec les données en mémoire.
 * @param {Object} io - Instance de Socket.IO pour gérer les événements.
 * @param {Object} data - Données liées au changement de sélection.
 * @param {number} data.oldSelectedId - ID de l'utilisateur précédemment sélectionné.
 * @param {number} data.newSelectedId - ID du nouvel utilisateur sélectionné.
 * @param {number} data.id - ID de l'utilisateur effectuant la sélection.
 * @param {string} data.newSelectedUserSocketId - ID du socket du nouvel utilisateur sélectionné.
 * @param {Object} userSocket - Instance du socket de l'utilisateur.
 * @throws {Error} Si une erreur survient lors du traitement de la mise à jour.
 */
const updateSelectedUserEvent = async (redis, io, data, userSocket) => {
    let { oldSelectedId, newSelectedId, id, newSelectedUserSocketId } = data;
    newSelectedId = parseInt(newSelectedId);

    console.log(`User ${id} selects ${newSelectedId}; Previous selection: ${oldSelectedId}`);

    try {
        if (oldSelectedId !== 0) {
            await deleteOldSelection(redis, io, oldSelectedId, id);
        } else {
            userSocket.leave("chat_room_global");
        }

        let conversationHistory = null;

        await notifyUser(io, userSocket, NOTIFY_CONVERSATION_HISTORY_EVENT ,conversationHistory);
        console.log(`Envoie de l'historique des message à l'utilisateur ${userId}  : ${conversationHistory}`);

        if (newSelectedId !== 0) {
            await addNewSelection(redis, newSelectedId, id);
            await checkMutualSelection(redis, io, newSelectedId, id, userSocket, newSelectedUserSocketId);
            conversationHistory = await getConversationHistory(id, newSelectedId);
        } else {
            conversationHistory = await getConversationHistory(0, 0);
            userSocket.join("chat_room_global");
        }

        await notifyConversationHistory(io, userSocket, conversationHistory);
        console.log(`Sent message history to user ${id}`);
    } catch (error) {
        console.error("Error while updating selected user:", error.message);
    }
};

/**
 * Supprime la sélection précédente d'un utilisateur.
 *
 * @function deleteOldSelection
 * @async
 * @param {Object} redis - Instance de Redis pour gérer les données liées aux salles et aux sélections.
 * @param {Object} io - Instance de Socket.IO pour interagir avec les salles.
 * @param {number} oldSelectedId - ID de l'utilisateur précédemment sélectionné (type long).
 * @param {number} id - ID de l'utilisateur effectuant la désélection (type long).
 * @throws {Error} Si une erreur survient lors de la suppression de la sélection.
 */
const deleteOldSelection = async (redis, io, oldSelectedId, id) => {
    try {
        const roomId = `chat_room_${Math.min(id, oldSelectedId)}_${Math.max(id, oldSelectedId)}`;
        deleteRoom(io, roomId);
        await logDetailsRedis(io, redis);

        await deleteInRedis(redis, SELECTED_USER_HASH, oldSelectedId, id);
        console.log(`Removed user ${id} from the list of users who selected: ${oldSelectedId}`);

        await deleteInRedis(redis, USER_ROOMS_HASH, id, roomId);
        await deleteInRedis(redis, USER_ROOMS_HASH, oldSelectedId, roomId);
        console.log(`Removed room ${roomId} relations between ${id} and ${oldSelectedId}`);
    } catch (error) {
        console.error("Error while removing old selection:", error.message);
    }
};

/**
 * Ajoute une nouvelle sélection pour un utilisateur.
 *
 * @function addNewSelection
 * @async
 * @param {Object} redis - Instance de Redis pour stocker la nouvelle sélection.
 * @param {number} newSelectedId - ID du nouvel utilisateur sélectionné.
 * @param {number} id - ID de l'utilisateur effectuant la sélection.
 * @throws {Error} Si une erreur survient lors de l'ajout de la nouvelle sélection.
 */
const addNewSelection = async (redis, newSelectedId, id) => {
    try {
        await addInRedis(redis, SELECTED_USER_HASH, newSelectedId, id);
        console.log(`Added user ${id} to the list of users who selected: ${newSelectedId}`);
    } catch (error) {
        console.error("Error while adding new selection:", error.message);
    }
};

/**
 * Vérifie la sélection mutuelle entre deux utilisateurs et crée une room si nécessaire.
 *
 * @function checkMutualSelection
 * @async
 * @param {Object} redis - Instance de Redis pour vérifier les sélections.
 * @param {Object} io - Instance de Socket.IO pour gérer les salles et les événements.
 * @param {number} newSelectedId - ID du nouvel utilisateur sélectionné.
 * @param {number} id - ID de l'utilisateur effectuant la sélection.
 * @param {Object} userSocket - Instance du socket de l'utilisateur.
 * @param {string} newSelectedUserSocketId - ID du socket du nouvel utilisateur sélectionné.
 * @throws {Error} Si une erreur survient lors de la vérification ou de la création de la salle.
 */
const checkMutualSelection = async (redis, io, newSelectedId, id, userSocket, newSelectedUserSocketId) => {
    try {
        const valueExists = await existsInRedis(redis, SELECTED_USER_HASH, id, newSelectedId);
        console.log(`Result existsInRedis: ${valueExists}; ${id} -> ${newSelectedId}`);
        if (!valueExists) return;

        console.log(`Users ${id} and ${newSelectedId} have mutually selected each other`);
        const roomId = `chat_room_${Math.min(id, newSelectedId)}_${Math.max(id, newSelectedId)}`;

        userSocket.join(roomId);
        const targetSocket = io.sockets.sockets.get(newSelectedUserSocketId);
        if (targetSocket) {
            targetSocket.join(roomId);
        }

        await addInRedis(redis, USER_ROOMS_HASH, id, roomId);
        await addInRedis(redis, USER_ROOMS_HASH, newSelectedId, roomId);

        io.to(roomId).emit("roomCreated", { roomId, users: [id, newSelectedId] });
        console.log(`Created room: ${roomId}`);
        await logDetailsRedis(io, redis);
    } catch (error) {
        console.error("Error while checking mutual selection:", error.message);
    }
};

/**
 * Récupère l'historique des messages entre deux utilisateurs.
 *
 * @function getConversationHistory
 * @async
 * @param {number} fromId - ID de l'utilisateur source.
 * @param {number} toId - ID de l'utilisateur cible.
 * @returns {Promise<Array<Object>>} Historique des messages sous forme de tableau d'objets.
 * @throws {Error} Si une erreur survient lors de la récupération des messages.
 */
export const getConversationHistory = async (fromId, toId) => {
    try {
        const response = await axios.get(`http://localhost:8088/messages?userId1=${fromId}&userId2=${toId}`);
        const conversationHistory = response.data;

        const conversationHistoryDto = conversationHistory.map(source => ({
            from: { id: source.fromId, username: source.fromUsername },
            content: source.content,
            time: source.time
        }));

        return conversationHistoryDto;
    } catch (error) {
        console.error("Error while retrieving conversation history:", error.message);
        throw error;
    }
};

export default updateSelectedUserEvent;