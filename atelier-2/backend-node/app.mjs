import express from 'express';
import Redis from 'ioredis';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import connectionEvent from "./events/connectionEvent.mjs";
import updateSelectedUserEvent from "./events/updateSelectedUserEvent.mjs";
import sendMessageEvent from "./events/sendMessageEvent.mjs";
import disconnectEvent from "./events/disconnectEvent.mjs";
import {CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH, WAITLIST_FIGHT_HASH} from "./utils/constants.mjs";
import {logDetailsRedis} from "./utils/redisUtils.mjs";
import {playEvent} from "./events/playEvent.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002; // React port

app.use(express.static(path.join(__dirname, 'public', 'my-chat-app', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'my-chat-app', 'build', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true }
});
const redis = new Redis();

await initServer(io, redis);

io.on("connection", async (socket) => {
  let { userId, username } = socket.handshake.query;
  if (!username) return console.log("Error: username is required.");

  await connectionEvent(redis, io, socket.id, userId, username);

  socket.on("updateSelectedUser", async (data) => {
    await updateSelectedUserEvent(redis, io, data, socket);
  });

  socket.on("sendMessage", async (data) => {
    await sendMessageEvent(redis, io, socket, data);
  });

  // Ajouter un utilisateur à la liste d'attente
  socket.on('play', async (userId) => {
    await playEvent(redis, io,userId, socket);
  /*
    await redis.rpush(WAITLIST_KEY, username);
      const waitlist = await redis.lrange(WAITLIST_KEY, 0, -1);
    io.emit('waitlistUpdated', waitlist);
    console.log(`${username} ajouté à la liste d'attente.`);
   */
  });


  socket.on("disconnecting", async () => {
    await disconnectEvent(redis, io, socket, userId, username);
  });
});

// Vider la file d'attente au démarrage
async function initServer(io, redis) {
  await redis.del(WAITLIST_FIGHT_HASH);
  await redis.set("userCounter", 0);
  await redis.del(CONNECTED_USERS_HASH);
  await redis.del(SELECTED_USER_HASH);
  await redis.del(USER_ROOMS_HASH);

  await logDetailsRedis(io, redis);
  console.log("init Server completed");
}
