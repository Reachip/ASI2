import {CONNECTED_USERS_HASH, NOTIFY_ROOM_FIGHT_CREATED_EVENT} from "../utils/constants.mjs";

export const updateConnectedUsers = async (io, redis) => {
    const connectedUsers  = await redis.hgetall(CONNECTED_USERS_HASH);

    const usersList = Object.values(connectedUsers).map(user => JSON.parse(user));
    console.log("Envoie mise à jour de la liste des utilisateurs connectés : "+JSON.stringify(usersList));

    // Envoi à tous les clients connectés
    io.emit("updateConnectedUsers", usersList);
}

export const notifyUser = async (io, userSocket , event, message) => {

    // Envoi à tous les clients connectés
    userSocket.emit(event, message);
}

export const notifyRoom = (io, roomId, event, message) => {
    io.to(roomId).emit(event,message);
}

export const notifyNewMessage = (socketUser, fromUsername, content, time) => {
    socketUser.emit('newMessage', {
        from: fromUsername,
        content,
        time
    });
    console.log(`Message envoyé à l'utilisateur ${fromUsername}`);
}

