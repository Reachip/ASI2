import {CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH} from "../utils/constants.mjs";
import {existsInRedis, getListFromRedis} from "../utils/redisUtils.mjs";
import SaveMessageActiveMq from "../activemq/SaveMessageActiveMQ.mjs";
import {notifyNewMessage} from "./notifyEvent.mjs";

const saveMessageInstance = new SaveMessageActiveMq();

const sendMessageEvent = async (redis, io, socket, data) => {
    const { from, to, content, time } = data;
    console.log(`sendMessageEvent: from: ${JSON.stringify(from)}; to: ${to}; content: ${content}; time: ${time} `);

    if(to==="all"){
        console.log(`Message à envoyer à tous les utilisaateurs `);

        io.to("chat_room_global").emit("newMessage", {
            from: from.username,
            content,
            time
        });
        console.log(`Message envoyé à la room chat_room_global`);

        await saveMessage(from.id, from.username, "0", "0", content, time);

    }
    else {
        const roomId = `chat_room_${Math.min(from.id, to.id)}_${Math.max(from.id, to.id)}`;

        // Dans le cas ou les utilisateurs sont tous les deux dans une room
        if (await existsInRedis(redis, USER_ROOMS_HASH,from.id,roomId)){
            // Envoie le message à tous les utilisateurs de la room
            io.to(roomId).emit("newMessage", {
                from: from.username,
                content,
                time
            });
            console.log(`Message envoyé à la room ${roomId}`);
        }
        else {
            // Si la room n'existe pas, envoie le message uniquement à l'utilisateur qui a émis l'événement
            notifyNewMessage(socket, from.username, content, time);
        }

        await saveMessage(from.id,  from.username, to.id, to.username, content, time);
    }
};

const saveMessage = async (fromUserId, fromUsername, toUserId, toUsername, content, time) => {
    const message = {
        fromUserId: fromUserId,
        fromUsername: fromUsername,
        toUserId: toUserId,
        toUsername: toUsername,
        content: content,
        time: time
    };

    // Affichage du message avant envoi
    console.log("Message avant envoi:", JSON.stringify(message));
    await saveMessageInstance.sendMessage(message);
}



export default sendMessageEvent;

/*
const sendToAllUsers = async (io, redis, socket, from, content, time) => {
    const listUserSelectedSender = await getListFromRedis(redis, SELECTED_USER_HASH,from.id);
    console.log(`Liste des personnes ayant sélectionné l'émetteur (${from.id}) :${listUserSelectedSender}`);

    const listConnectedUser = await redis.hgetall(CONNECTED_USERS_HASH);
    // Transforme les valeurs du hash en une liste d'objets utilisateur
    const parsedUsers = Object.values(listConnectedUser).map((userString) => JSON.parse(userString));
    const listConnectedUserFiltered = parsedUsers.filter(user => user.userId !== from.id)
    console.log(`Liste des personnes connectées :${JSON.stringify(listConnectedUserFiltered)}`);

    listConnectedUserFiltered.map(async (connectedUser) => {
        console.log(`connectedUser ${JSON.stringify(connectedUser)}`);

        if (listUserSelectedSender.includes(connectedUser.userId)){
            const toUserSocket = io.sockets.sockets.get(connectedUser.socketId );

            notifyNewMessage(toUserSocket, from.username, content, time);
        }

        await saveMessage(from.id, from.username, connectedUser.id, connectedUser.username, content, time);

    });
    notifyNewMessage(socket, from.username, content, time);
}
*/