import { CONNECTED_USERS_HASH } from "../utils/constants.mjs";

export const updateConnectedUsers = async (io, redis) => {
    try {
        const connectedUsers = await redis.hgetall(CONNECTED_USERS_HASH);
        try {
            const usersList = Object.values(connectedUsers).map(user => JSON.parse(user));
            console.log("Sending updated list of connected users:", JSON.stringify(usersList));

            io.emit("updateConnectedUsers", usersList);
        } catch (error) {
            console.error("Error parsing or emitting connected users list:", error.message);
        }
    } catch (error) {
        console.error("Error retrieving connected users from Redis:", error.message);
    }
};

export const notifyConversationHistorique = async (io, userSocket, messages) => {
    try {
        userSocket.emit("notifyConversationHistory", messages);
        console.log("Conversation history sent successfully.");
    } catch (error) {
        console.error("Error notifying conversation history:", error.message);
    }
};

export const notifyNewMessage = (socketUser, fromId, fromUsername, content, time) => {
    try {
        socketUser.emit('newMessage', {
            from: { id: fromId, username: fromUsername },
            content,
            time
        });
        console.log(`Message sent to user ${fromUsername}.`);
    } catch (error) {
        console.error(`Error notifying new message to user ${fromUsername}:`, error.message);
    }
};