import { deleteRoom } from "../utils/roomUtils.mjs";
import { addInRedis, deleteInRedis, existsInRedis, logDetailsRedis } from "../utils/redisUtils.mjs";
import { SELECTED_USER_HASH, USER_ROOMS_HASH } from "../utils/constants.mjs";
import axios from 'axios';
import { notifyConversationHistorique } from "./notifyEvent.mjs";

const updateSelectedUserEvent = async (redis, io, data, userSocket) => {
    const { oldSelectedId, newSelectedId, id, newSelectedUserSocketId } = data;
    console.log(`User ${id} selects ${newSelectedId}; Previous selection: ${oldSelectedId}`);

    try {
        if (oldSelectedId !== "all") {
            await deleteOldSelection(redis, io, oldSelectedId, id);
        } else {
            userSocket.leave("chat_room_global");
        }

        let conversationHistory = null;

        if (newSelectedId !== "all") {
            await addNewSelection(redis, newSelectedId, id);
            await checkMutualSelection(redis, io, newSelectedId, id, userSocket, newSelectedUserSocketId);
            conversationHistory = await getConversationHistory(id, newSelectedId);
        } else {
            conversationHistory = await getConversationHistory("0", "0");
            userSocket.join("chat_room_global");
        }

        await notifyConversationHistorique(io, userSocket, conversationHistory);
        console.log(`Sent message history to user ${id}:`, conversationHistory);
    } catch (error) {
        console.error("Error while updating selected user:", error.message);
    }
};

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

const addNewSelection = async (redis, newSelectedId, id) => {
    try {
        await addInRedis(redis, SELECTED_USER_HASH, newSelectedId, id);
        console.log(`Added user ${id} to the list of users who selected: ${newSelectedId}`);
    } catch (error) {
        console.error("Error while adding new selection:", error.message);
    }
};

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

export const getConversationHistory = async (fromId, toId) => {
    try {
        const response = await axios.get(`http://localhost:8088/messages?userId1=${fromId}&userId2=${toId}`);
        const conversationHistory = response.data;
        console.log("Retrieved conversation history:", conversationHistory);

        const conversationHistoryDto = conversationHistory.map(source => ({
            from: { id: source.fromId, username: source.fromUsername },
            content: source.content,
            time: source.time
        }));
        console.log("Transformed conversation history:", conversationHistoryDto);

        return conversationHistoryDto;
    } catch (error) {
        console.error("Error while retrieving conversation history:", error.message);
        throw error;
    }
};

export default updateSelectedUserEvent;