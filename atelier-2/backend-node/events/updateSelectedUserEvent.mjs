import {deleteRoom} from "../utils/roomUtils.mjs";
import {addInRedis, deleteInRedis, existsInRedis, logDetailsRedis} from "../utils/redisUtils.mjs";
import {SELECTED_USER_HASH, USER_ROOMS_HASH} from "../utils/constants.mjs";
import axios from 'axios';
import {notifyConversationHistorique} from "./notifyEvent.mjs";

const updateSelectedUserEvent = async (redis, io, data, userSocket) => {
    const { oldSelectedUserId, newSelectedUserId, userId, newSelectedUserSocketId } = data;
    console.log(`Utilisateur ${userId} sélectionne ${newSelectedUserId }; Ancienne selection: ${oldSelectedUserId}`);

    // Seulement dans le cas ou l'ancien utilisateur selectionné n'etait pas all
    if (oldSelectedUserId !== "all" ){
        // Suppression de la relation avec l'ancient utilisateur selectionné
        await deleteOldSelection(redis, io, oldSelectedUserId, userId);
    }
    else {
        userSocket.leave("chat_room_global");
    }

    let conversationHistory = null;
    // Seulement dans le cas ou le nouveau utilisateur selectionné n'est pas all
    if (newSelectedUserId !== "all" ) {
        // Ajout de la relation avec le nouveau utilisateur selectionné
        await addNewSelection(redis, newSelectedUserId, userId);
        await checkMutualSelection(redis, io, newSelectedUserId, userId, userSocket, newSelectedUserSocketId);
        conversationHistory =  await getConversationHistory(userId,newSelectedUserId);
    }
    else{
        // Récupération de la conversation du chat global
        conversationHistory =  await getConversationHistory("0","0");
        userSocket.join("chat_room_global");
    }

    await notifyConversationHistorique(io, userSocket, conversationHistory);
    console.log(`Envoie de l'historique des message à l'utilisateur ${userId}  : ${conversationHistory}`);

};

const deleteOldSelection = async (redis, io, oldSelectedUserId, userId) => {
    const roomId = `chat_room_${Math.min(userId, oldSelectedUserId)}_${Math.max(userId, oldSelectedUserId)}`;
    deleteRoom(io, roomId);
    await logDetailsRedis(io,redis);

    await deleteInRedis(redis, SELECTED_USER_HASH, oldSelectedUserId, userId);
    console.log(`Suppression de l'utilisateur ${userId} dans la liste des personnes ayant sélectionné : `+oldSelectedUserId);

    await deleteInRedis(redis, USER_ROOMS_HASH, userId, roomId);
    await deleteInRedis(redis, USER_ROOMS_HASH, oldSelectedUserId, roomId);
    console.log(`Suppression des relations de la room ${roomId} entre ${userId} et ${oldSelectedUserId}`);
}
const addNewSelection = async (redis, newSelectedUserId, userId) => {
    await addInRedis(redis, SELECTED_USER_HASH,newSelectedUserId,userId);
    console.log(`Ajout de l'utilisateur ${userId} dans la liste des personnes ayant sélectionné : `+newSelectedUserId);
}

const checkMutualSelection = async (redis, io, newSelectedUserId, userId, userSocket, newSelectedUserSocketId) => {
    const valueExists = await existsInRedis(redis, SELECTED_USER_HASH,userId,newSelectedUserId);
    console.log(`Result existsInRedis : ${valueExists} ; ${userId} -> ${newSelectedUserId} `);
    if (!valueExists) return ;
    console.log(`Les utilisateurs ${userId} et ${newSelectedUserId} se sont tous les deux sélectionnés`);

    // Crée un identifiant de room unique basé sur les IDs des deux utilisateurs
    const roomId = `chat_room_${Math.min(userId, newSelectedUserId)}_${Math.max(userId, newSelectedUserId)}`;

    // Ajoute les utilisateurs dans cette room
    userSocket.join(roomId);
    const targetSocket = io.sockets.sockets.get(newSelectedUserSocketId);
    if (targetSocket) {
        targetSocket.join(roomId);
    }

    await addInRedis(redis, USER_ROOMS_HASH,userId,roomId);
    await addInRedis(redis, USER_ROOMS_HASH,newSelectedUserId,roomId);

    // Envoie une confirmation de la room aux deux utilisateurs
    io.to(roomId).emit("roomCreated", {roomId, users: [userId, newSelectedUserId]});
    console.log(`Création de la room: ${roomId}`);
    await logDetailsRedis(io,redis);

}

export const getConversationHistory = async (fromUserId, toUserId) => {
    try {

        const response = await axios.get("http://localhost:8080/api/messages?userId1="+fromUserId+"&userId2="+toUserId);
        const conversationHistory = response.data;
        console.log("Historique de conversation récupéré :", conversationHistory);

        const conversationHistoryDto = conversationHistory.map(source => ({
            from: source.fromUsername,
            content: source.content,
            time: source.time
        }));
        console.log("Historique de conversation transformé :", conversationHistoryDto);

        return conversationHistoryDto;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique de conversation :", error.message);
        throw error;
    }
}

export default updateSelectedUserEvent;