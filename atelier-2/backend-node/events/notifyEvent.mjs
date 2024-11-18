import {CONNECTED_USERS_HASH} from "../utils/constants.mjs";

export const updateConnectedUsers = async (io, redis) => {
    const connectedUsers  = await redis.hgetall(CONNECTED_USERS_HASH);

    const usersList = Object.values(connectedUsers).map(user => JSON.parse(user));
    console.log("Envoie mise à jour de la liste des utilisateurs connectés : "+JSON.stringify(usersList));

    // Envoi à tous les clients connectés
    io.emit("updateConnectedUsers", usersList);
}

export const notifyConversationHistorique = async (io, userSocket ,messages) => {

    // Envoi à tous les clients connectés
    userSocket.emit("notifyConversationHistory", messages);
}

export const notifyNewMessage = (socketUser, fromUsername, content, time) => {
    socketUser.emit('newMessage', {
        from: fromUsername,
        content,
        time
    });
    console.log(`Message envoyé à l'utilisateur ${fromUsername}`);
}