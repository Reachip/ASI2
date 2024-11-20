import {addInRedis, logDetailsRedis} from "../utils/redisUtils.mjs";
import {notifyUser, updateConnectedUsers} from "./notifyEvent.mjs";
import {CONNECTED_USERS_HASH, NOTIFY_CONVERSATION_HISTORY_EVENT} from "../utils/constants.mjs";
import {getConversationHistory} from "./updateSelectedUserEvent.mjs";

const connectionEvent = async (redis, io, socketId, userId, username) => {
    console.log("Utilisateur connecté :",userId, username, socketId);

    const previousConnection = await redis.hget("connectedUsers", userId);
    // Si l'utilisateur est déjà connecté, déconnecter l'ancienne socket
    if (previousConnection) {
        const previousData = JSON.parse(previousConnection);
        const previousSocket = io.sockets.sockets.get(previousData.socketId);
        if (previousSocket) previousSocket.disconnect(true);
    }

    // Sauvegarder l'utilisateur dans la liste des utilisateurs connectés
    await redis.hset(CONNECTED_USERS_HASH, userId, JSON.stringify({ username: username, userId: userId, socketId: socketId }));

    const userSocket = io.sockets.sockets.get(socketId)
    userSocket.join("chat_room_global");
    const conversationHistory =  await getConversationHistory("0","0");
    await notifyUser(io, userSocket, NOTIFY_CONVERSATION_HISTORY_EVENT, conversationHistory);

    await logDetailsRedis(io,redis);
    await updateConnectedUsers(io,redis);
};

export default connectionEvent;