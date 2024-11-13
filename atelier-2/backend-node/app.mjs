  import { Server } from "socket.io";
  import Redis from "ioredis";
  import express from "express";
  import path from "path";
  import { fileURLToPath } from "url";
  import SaveMessageActiveMQ from './activemq/SaveMessageActiveMQ.mjs';


  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = 3002; // Même port que React

  // Hash pour stocker les utilisateurs connectés avec leur ID, nom d'utilisateur, et socket
  const CONNECTED_USERS_HASH = "connectedUsers";
  // Hash pour stocker les rooms associées à chaque utilisateur
  const USER_ROOMS_HASH = "userRooms";
  // Hash pour stocker les utilisateurs sélectionnés (relation de sélection)
  const SELECTED_USER_HASH = "selectedUser";



  const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });

  // Configure la route pour servir le fichier HTML
  app.use(express.static(path.join(__dirname, 'public', 'my-chat-app', 'build')));

  // Route pour récupérer l'application React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-chat-app', 'build', 'index.html'));
  });

  // Associe Socket.IO au serveur Express
  // Configurer Socket.IO avec les options CORS
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Autorise uniquement localhost:3000
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"], // Ajoute ici des headers personnalisés si nécessaire
      credentials: true // Autorise l'envoi de cookies avec les requêtes, si nécessaire
    }
  });

  const redis = new Redis();



// Vider la file d'attente au démarrage
async function initServer() {
  await redis.del("waitingQueue");
  await redis.set("userCounter", 0);
  await redis.del(CONNECTED_USERS_HASH);
  await redis.del(SELECTED_USER_HASH);
  await redis.del(USER_ROOMS_HASH);

  await logDetailsRedis();
  console.log("init Server completed");
}

// Appel de la fonction pour vider la file d'attente
  initServer();

// Gestion des connexions Socket.IO
io.on("connection", async (socket) => {
  let { userId, username } = socket.handshake.query;

  if (!username) {
    console.log("Erreur : username est requis.");
    return;
  }
  await connectionEvent(userId, username, socket.id);

  socket.on("updateSelectedUser", async (data) => {
    const {oldSelectedUserId, newSelectedUserId, userId, newSelectedUserSocketId} = data;
    await updateSelectedUserEvent(oldSelectedUserId, newSelectedUserId, userId, newSelectedUserSocketId, socket);
  });

  // Gestion des messages envoyés entre utilisateurs
  socket.on("sendMessage", async (data) => {
    await sendMessageEvent(socket, data);
  });

  // Gestion de la déconnexion de l'utilisateur
  socket.on("disconnecting", async () => {
    await disconnectEvent(userId, username, socket.id);
  });

});

  const sendMessageEvent = async (socket, data) =>{
    const { from, to, content, time } = data;

    const roomId = `chat_room_${Math.min(from.id, to)}_${Math.max(from.id, to)}`;

    // Dans le cas ou les utilisateurs sont tous les deux dans une room
    if (await existsInRedis(USER_ROOMS_HASH,from.id,roomId)){
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



    // TODO save message
  }

  const updateSelectedUserEvent = async (oldSelectedUserId, newSelectedUserId, userId, newSelectedUserSocketId, userSocket) => {
    console.log(`Utilisateur ${userId} sélectionne ${newSelectedUserId==null? "all" : newSelectedUserId }; Ancienne selection: ${oldSelectedUserId==null? "all" : oldSelectedUserId }`);

    // Seulement dans le cas ou l'ancien utilisateur selectionné n'etait pas all
    if (oldSelectedUserId != null ){
      // Suppression de la relation avec l'ancient utilisateur selectionné
      await deleteOldSelection(oldSelectedUserId, userId);
    }

    // Seulement dans le cas ou le nouveau utilisateur selectionné n'est pas all
    if (newSelectedUserId != null ) {
      // Ajout de la relation avec le nouveau utilisateur selectionné
      await addNewSelection(newSelectedUserId, userId);
      await checkMutualSelection(newSelectedUserId, userId, userSocket, newSelectedUserSocketId);
    }
  }

  const deleteOldSelection = async (oldSelectedUserId, userId) => {
    const roomId = `chat_room_${Math.min(userId, oldSelectedUserId)}_${Math.max(userId, oldSelectedUserId)}`;
    deleteRoom(roomId);
    await logDetailsRedis();

    await deleteInRedis(SELECTED_USER_HASH, oldSelectedUserId, userId);
    console.log(`Suppression de l'utilisateur ${userId} pour : `+oldSelectedUserId);

    await deleteInRedis(USER_ROOMS_HASH, userId, roomId);
    await deleteInRedis(USER_ROOMS_HASH, oldSelectedUserId, roomId);
    console.log(`Suppression des relation de la room ${roomId} entre ${userId} et ${oldSelectedUserId}`);
  }
  const addNewSelection = async (newSelectedUserId, userId) => {
    await addInRedis(SELECTED_USER_HASH,userId,newSelectedUserId);
    console.log(`Ajout de l'utilisateur ${userId} pour avoir sélectionné : `+newSelectedUserId);
  }

  const addInRedis = async (hash, key, value) => {
    try {
      // Récupérer la valeur actuelle
      let valueOfKey = await redis.hget(hash, key);
      console.log(`Valeur de ${hash} pour ${key}: ${valueOfKey}`);

      // Initialiser avec une liste vide si la clé n'existe pas encore
      let listValueOfKey = valueOfKey ? JSON.parse(valueOfKey) : [];

      // Ajouter la nouvelle valeur si elle n'existe pas déjà
      if (!listValueOfKey.includes(value)) {
        listValueOfKey.push(value);
        console.log(`Ajout de ${value} dans ${hash} pour ${key}`);

        // Mettre à jour Redis avec la liste modifiée
        await redis.hset(hash, key, JSON.stringify(listValueOfKey));
        console.log(`Résultat après ajout: ${hash}, ${key}: ${JSON.stringify(listValueOfKey)}`);
      } else {
        console.log(`${value} existe déjà dans ${hash} pour ${key}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'ajout de ${value} dans ${hash} pour ${key}:`, error);
    }
  };
  const deleteInRedis = async (hash, key, value) => {
    try {
      let valueOfKey = await redis.hget(hash, key);
      console.log(`Valeur de ${hash} pour ${key}: ${valueOfKey}`);

      if (valueOfKey) {
        let listValueOfKey = JSON.parse(valueOfKey);

        // Vérifie si `value` est dans la liste
        if (listValueOfKey.includes(value)) {
          // Supprime `value` de la liste
          listValueOfKey = listValueOfKey.filter(id => id !== value);
          console.log(`Suppression de ${value} dans ${hash} pour ${key}`);

          // Si la liste est vide, supprime la clé
          if (listValueOfKey.length === 0) {
            await redis.hdel(hash, key);
            console.log(`Suppression de la clé ${key} car la liste est vide.`);
          } else {
            // Sinon, met à jour la liste dans Redis
            await redis.hset(hash, key, JSON.stringify(listValueOfKey));
            console.log(`Résultat après suppression : ${hash}, ${key}: ${JSON.stringify(listValueOfKey)}`);
          }
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression dans ${hash} pour ${key}:`, error);
    }
  };
  const existsInRedis = async (hash, key, value) => {
    try {
      // Récupère la valeur associée à la clé dans le hash
      const valueOfKey = await redis.hget(hash, key);
      console.log(`Valeur actuelle de ${hash} pour ${key}: ${valueOfKey}`);

      // Si la clé n'existe pas ou est vide, retourne `false`
      if (!valueOfKey) {
        return false;
      }

      // Parse la liste JSON et vérifie la présence de la valeur
      const listValueOfKey = JSON.parse(valueOfKey);
      const exists = listValueOfKey.includes(value);

      console.log(`La valeur ${value} ${exists ? "existe" : "n'existe pas"} dans ${hash} pour ${key}`);
      return exists;
    } catch (error) {
      console.error(`Erreur lors de la vérification dans ${hash} pour ${key}:`, error);
      return false;
    }
  };

  const getListFromRedis = async (hash, key) => {
    try {
      // Récupère la valeur associée à la clé dans le hash
      const valueOfKey = await redis.hget(hash, key);
      console.log(`Valeur de ${hash} pour ${key}: ${valueOfKey}`);

      // Si la clé n'existe pas, retourne une liste vide
      if (!valueOfKey) {
        return [];
      }

      // Parse la valeur JSON et retourne comme liste
      return JSON.parse(valueOfKey);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la liste dans ${hash} pour ${key}:`, error);
      return []; // En cas d'erreur, retourne une liste vide
    }
  };
  const checkMutualSelection = async (newSelectedUserId, userId, userSocket, newSelectedUserSocketId) => {
    const valueExists = await existsInRedis(SELECTED_USER_HASH,userId,newSelectedUserId);
    if (!valueExists) return ;
    console.log(`Les utilisateurs ${userId} et ${newSelectedUserId} se sont tous les deux sélectionnés`);

    // Crée un identifiant de room unique basé sur les IDs des deux utilisateurs
    const roomId = `chat_room_${Math.min(userId, newSelectedUserId)}_${Math.max(userId, newSelectedUserId)}`;

    // Ajoute les utilisateurs dans cette room
    userSocket.join(roomId);
    const targetSocket = io.sockets.sockets.get(newSelectedUserSocketId);
    if (targetSocket) {
      targetSocket.join(roomId);
    }

    await addInRedis(USER_ROOMS_HASH,userId,roomId);
    await addInRedis(USER_ROOMS_HASH,newSelectedUserId,roomId);

    // Envoie une confirmation de la room aux deux utilisateurs
    io.to(roomId).emit("roomCreated", {roomId, users: [userId, newSelectedUserId]});
    console.log(`Création de la room: ${roomId}`);
    await logDetailsRedis();

  }

  const roomExists = (roomId) => {
    return io.sockets.adapter.rooms.has(roomId) ? true : false;
  };
  const deleteRoom = (roomId)=>{
    if (roomExists(roomId)) {
      const room = io.sockets.adapter.rooms.get(roomId);
      // Itérer sur chaque socket dans la room et les en faire sortir
      for (const socketId of room) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(roomId);
        }
      }
      console.log(`La room ${roomId} à été supprimé.`);
    }
  }

  const connectionEvent = async (userId, username, socketId) => {
    console.log("Utilisateur connecté :",userId, username, socketId);

    const previousConnection = await redis.hget("connectedUsers", userId);
    // Si l'utilisateur est déjà connecté, déconnecter l'ancienne socket
    if (previousConnection) {
      const previousData = JSON.parse(previousConnection);
      const previousSocket = io.sockets.sockets.get(previousData.socketId);
      if (previousSocket) previousSocket.disconnect(true);
    }

    // Sauvegarder l'utilisateur dans la liste des utilisateurs connectés
    await redis.hset("connectedUsers", userId, JSON.stringify({ username: username, userId: userId, socketId: socketId }));

    await logDetailsRedis();
    await updateConnectedUsers();
  }

  const disconnectEvent = async (userId, username, socketId) => {
    console.log("Utilisateur déconnecté :", userId, username, socketId);

    const socket = io.sockets.sockets.get(socketId);

    // Supprimer l'utilisateur des utilisateurs connectés
    await redis.hdel("connectedUsers", userId);

    // Récupère toutes les rooms auxquelles l'utilisateur était connecté
    const rooms = await getListFromRedis(USER_ROOMS_HASH,userId);
    console.log("L'utilisateur était connecté aux rooms :", rooms);

    for (const room of rooms) {
      if (room.includes("chat_room")) {
        // Extraire les deux IDs d'utilisateur de la room
        const match = room.match(/^chat_room_(\d+)_(\d+)$/);
        if (match) {
          const id1 = match[1];
          const id2 = match[2];
          const otherUserId = id1 === userId.toString() ? id2 : id1;

          // Supprimer la relation d'utilisateur dans Redis
          await deleteInRedis(SELECTED_USER_HASH, userId, otherUserId);
          await deleteInRedis(SELECTED_USER_HASH, otherUserId, userId);
          console.log(`Suppression des relation de selection entre ${userId} et ${otherUserId}`);
          await deleteInRedis(USER_ROOMS_HASH, userId, room);
          await deleteInRedis(USER_ROOMS_HASH, otherUserId, room);
          console.log(`Suppression des relation de la room ${room} entre ${userId} et ${otherUserId}`);
        }
      }
      deleteRoom(room);
    }

    await logDetailsRedis();

    await updateConnectedUsers();
  }


  // Fonction pour émettre la liste mise à jour des utilisateurs connectés à tous les utilisateurs
  const updateConnectedUsers = async () => {
    const connectedUsers  = await redis.hgetall("connectedUsers");
    const usersList = Object.values(connectedUsers).map(user => JSON.parse(user));
    console.log("Envoie mise à jour de la liste des utilisateurs connectés : "+JSON.stringify(usersList));

    // Envoi à tous les clients connectés
    io.emit("updateConnectedUsers", usersList);
  }

  const logDetailsRedis = async ()=>{
    console.log("Nombre d'utilisateurs connectés :",await redis.hlen("connectedUsers"));
    console.log(`Nombre de rooms actives : ${io.sockets.adapter.rooms.size}`);
  }
