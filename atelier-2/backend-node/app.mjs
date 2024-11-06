import { Server } from "socket.io";
import Redis from "ioredis";

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

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
  let { userId } = socket.handshake.query;

  // Création de la room de chat
  const chatRoomId = `user-${userId}`;

  socket.join(chatRoomId);

  console.log("Utilisateur connecté :", userId, socket.id);

  // Gestion des messages envoyés par un utilisateur
  socket.on("sendMessage", async (data) => {
    console.log(`${userId} send message '${data.message}' to ${data.userIdDestination}`)
    const { userIdDestination, message } = data;

    io.to(`user-${userIdDestination}`).emit("receiveMessage", JSON.stringify({userIdOrigin: userId, message}));

    // Récupère les informations de la room depuis Redis
    // const roomInfo = await redis.hgetall(roomId);
  });

  // Gestion du combat
  socket.on("play", async () => {
    console.log("Utilisateur veut combattre :", userId, socket.id);

    // Ajoute l'utilisateur actuel à la file d'attente
    await redis.rpush("waitingQueue", JSON.stringify({ userId, socketId: socket.id }));

    // Vérifie si deux utilisateurs sont en file d'attente
    const queueLength = await redis.llen("waitingQueue");
    if (queueLength >= 2) {
      // Récupère les deux premiers utilisateurs de la file d'attente
      const user1 = JSON.parse(await redis.lpop("waitingQueue"));
      const user2 = JSON.parse(await redis.lpop("waitingQueue"));

      // Création de la room pour le combat des deux utilisateurs
      const fightRoomId = `fight-${user1.userId}-${user2.userId}`;

      // Faire rejoindre les deux utilisateurs à la même room de combat
      io.sockets.sockets.get(user1.socketId)?.join(fightRoomId);
      io.sockets.sockets.get(user2.socketId)?.join(fightRoomId);

      console.log(`Room de combat ${fightRoomId} créée entre ${user1.userId} et ${user2.userId}`);

      // Notifie les deux utilisateurs que le combat a commencé
      io.to(fightRoomId).emit("fightStarted", { fightRoomId, opponents: [user1.userId, user2.userId] });
    }

  });

  // Gestion de la déconnexion de l'utilisateur
  socket.on("disconnect", async () => {
    console.log("Utilisateur déconnecté :", userId, socket.id);

    // Retirer l'utilisateur de sa room de chat
    socket.leave(chatRoomId);

  });
});
