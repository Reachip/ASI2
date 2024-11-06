import { Server } from "socket.io";
import Redis from "ioredis";

const io = new Server(3000);
const redis = new Redis();


async function assignUsername() {
  // Utilise un compteur Redis pour générer un identifiant unique
  const userId = await redis.incr("userCounter");
  return `user${userId}`;
}

// Fonction pour créer une room et stocker les informations dans Redis
async function createRoom(user1, user2) {
  const roomId = `room-${user1.socketId}-${user2.socketId}`;

  const socketUser1 =  io.sockets.sockets.get(user1.socketId);
  const socketUser2 =  io.sockets.sockets.get(user2.socketId);
  // Ajoute les utilisateurs à la room dans Socket.IO
  socketUser1.join(roomId);
  socketUser2.join(roomId);

  // Enregistre la room avec les utilisateurs dans Redis
  await redis.hmset(roomId, {
    user1: user1,
    user2: user2,
  });

  // Envoie la notification d'appariement à chaque utilisateur
  socketUser1.emit("paired", { roomId, pairedUser: user2.username });
  socketUser2.emit("paired", { roomId, pairedUser: user1.username });

  console.log(`Room créée : ${roomId} pour ${user1.username} et ${user2.username}`);
}

// Vider la file d'attente au démarrage
async function clearWaitingQueue() {
  await redis.del("waitingQueue");
  await redis.set("userCounter", 0);
  console.log("La file d'attente a été vidée.");
}

// Appel de la fonction pour vider la file d'attente
clearWaitingQueue();

// Gestion des connexions Socket.IO
io.on("connection", async (socket) => {
  let { username } = socket.handshake.query;

  // Si aucun `username` n'est fourni, en attribuer un par défaut
  if (!username) {
    username = await assignUsername();
  }

  if (!username) {
    console.log("Erreur : username est requis.");
    return;
  }

  console.log("Utilisateur connecté :", username, socket.id);

  // Enregistre le lien username-socketId dans Redis
  await redis.set(`user:${username}`, socket.id);

  // Ajoute l'utilisateur à la file d'attente Redis
  await redis.rpush("waitingQueue", JSON.stringify({ username, socketId: socket.id }));

  // Vérifie si deux utilisateurs sont en file d'attente
  const queueLength = await redis.llen("waitingQueue");
  if (queueLength >= 2) {
    // Récupère les deux premiers utilisateurs de la file d'attente
    const user1 = JSON.parse(await redis.lpop("waitingQueue"));
    const user2 = JSON.parse(await redis.lpop("waitingQueue"));

    // Crée une room pour ces deux utilisateurs
    createRoom(user1, user2);
  }

  // Gestion des messages envoyés entre utilisateurs
  socket.on("message", async (data) => {
    const { roomId, text } = data;

    // Récupère les informations de la room depuis Redis
    const roomInfo = await redis.hgetall(roomId);
    const sender = roomInfo.user1 && JSON.parse(roomInfo.user1).socketId === socket.id ? "user1" : "user2";
    const recipient = sender === "user1" ? "user2" : "user1";

    // Envoie le message au destinataire dans la même room
    io.to(JSON.parse(roomInfo[recipient]).socketId).emit("message", { from: username, text });
  });

  // Gestion de la déconnexion de l'utilisateur
  socket.on("disconnect", async () => {
    console.log("Utilisateur déconnecté :", username, socket.id);
    await redis.del(`user:${username}`);

    const queue = await redis.lrange("waitingQueue", 0, -1);
    const userIndex = queue.findIndex((u) => JSON.parse(u).socketId === socket.id);
    if (userIndex !== -1) {
      await redis.lrem("waitingQueue", 1, queue[userIndex]);
    }

    // Supprimer la room si l'utilisateur se déconnecte
    const roomId = `room-${user1Data.socketId}-${user2Data.socketId}`; // Générer l'ID de la room si nécessaire

    const roomInfo = await redis.hgetall(roomId);
    if (roomInfo) {
      const otherUserSocketId = JSON.parse(roomInfo[sender === "user1" ? "user2" : "user1"]).socketId;

      // Informer l'autre utilisateur que la room est fermée
      io.to(otherUserSocketId).emit("roomClosed", { message: "L'autre utilisateur s'est déconnecté." });

      // Supprimer la room de Redis
      await redis.del(roomId);
      console.log(`Room ${roomId} supprimée car ${username} s'est déconnecté.`);
    }
  });
});
