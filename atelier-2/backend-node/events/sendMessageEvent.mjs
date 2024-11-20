import { CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH } from "../utils/constants.mjs";
import { existsInRedis, getListFromRedis } from "../utils/redisUtils.mjs";
import SaveMessageActiveMq from "../activemq/SaveMessageActiveMQ.mjs";
import { notifyNewMessage } from "./notifyEvent.mjs";

const saveMessageInstance = new SaveMessageActiveMq();

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