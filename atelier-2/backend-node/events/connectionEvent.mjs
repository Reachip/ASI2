import { addInRedis, logDetailsRedis } from "../utils/redisUtils.mjs";
import { notifyConversationHistory, updateConnectedUsers } from "./notifyEvent.mjs";
import { CONNECTED_USERS_HASH } from "../utils/constants.mjs";
import { getConversationHistory } from "./updateSelectedUserEvent.mjs";

const connectionEvent = async (redis, io, socketId, id, username) => {
    console.log("Connected user:", id, username, socketId);

    try {
        const previousConnection = await redis.hget("connectedUsers", id);
        if (previousConnection) {
            try {
                const previousData = JSON.parse(previousConnection);
                const previousSocket = io.sockets.sockets.get(previousData.socketId);
                if (previousSocket) {
                    previousSocket.disconnect(true);
                    console.log(`Previous socket for user ${id} disconnected.`);
                }
            } catch (error) {
                console.error("Error handling previous connection:", error.message);
            }
        }

        try {
            await redis.hset(CONNECTED_USERS_HASH, id, JSON.stringify({ id: id, username: username, socketId: socketId }));
            console.log(`User ${id} added to connected users in Redis.`);
        } catch (error) {
            console.error("Error adding user to Redis:", error.message);
        }

        try {
            const userSocket = io.sockets.sockets.get(socketId);
            if (userSocket) {
                userSocket.join("chat_room_global");
                console.log(`User ${id} joined global chat room.`);
            }

            const conversationHistory = await getConversationHistory(0, 0);
            await notifyConversationHistory(io, userSocket, conversationHistory);
            console.log(`Conversation history sent to user ${id}.`);
        } catch (error) {
            console.error("Error handling global chat room or sending history:", error.message);
        }

        try {
            await logDetailsRedis(io, redis);
            await updateConnectedUsers(io, redis);
            console.log(`Connected users updated for user ${id}.`);
        } catch (error) {
            console.error("Error logging Redis details or updating connected users:", error.message);
        }
    } catch (error) {
        console.error("Error in connectionEvent:", error.message);
    }
};

export default connectionEvent;