import {USER_ROOMS_HASH} from "../utils/constants.mjs";
import {existsInRedis} from "../utils/redisUtils.mjs";
import SaveMessageActiveMq from "../activemq/SaveMessageActiveMQ.mjs";

const saveMessageInstance = new SaveMessageActiveMq();

const sendMessageEvent = async (redis, io, socket, data) => {
    const { from, to, content, time } = data;

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
        socket.emit('newMessage', {
            from: from.username,
            content,
            time
        });
        console.log(`Message envoyé à l'utilisateur ${from.username}`);
    }

    const message = {
        fromUserId: from.id,
        fromUsername: from.username,
        toUserId: to.id,
        toUsername: to.username,
        content: content,
        time: time
    };
    // Affichage du message avant envoi
    console.log("Message avant envoi:", JSON.stringify(message));
    await saveMessageInstance.sendMessage(message);

};

export default sendMessageEvent;