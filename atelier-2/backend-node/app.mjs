import express from 'express';
import Redis from 'ioredis';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import connectionEvent from "./events/connectionEvent.mjs";
import updateSelectedUserEvent from "./events/updateSelectedUserEvent.mjs";
import sendMessageEvent from "./events/sendMessageEvent.mjs";
import disconnectEvent from "./events/disconnectEvent.mjs";
import {playEvent} from "./events/playEvent.mjs";
import attackEvent from './events/attackEvent.mjs';
import endTurnEvent from './events/endTurnEvent.mjs';
import setRewardAmountEvent from './events/setRewardAmountEvent.mjs';
import {initServer} from "./utils/redisUtils.mjs";


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

const io = new Server(server, {cors: { origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true }});
const redis = new Redis();

await initServer(io, redis);

io.on("connection", async (socket) => {

  let { id, username } = socket.handshake.query;
  if (!id) return console.log("Error: user id is required.");

  await connectionEvent(redis, io, socket.id, id, username);

  socket.on("updateSelectedUser", async (data) => {
    await updateSelectedUserEvent(redis, io, data, socket);
  });

  socket.on("sendMessage", async (data) => {
    await sendMessageEvent(redis, io, socket, data);
  });

  // Ajouter un utilisateur à la liste d'attente
  socket.on('play', async (userId) => {
    await playEvent(redis, io,userId, socket);
  });

  socket.on("disconnecting", async () => {
    await disconnectEvent(redis, io, socket, id, username);
  });

  socket.on("setRewardAmount", async (data) => {
    await setRewardAmountEvent(redis, io, socket, data);
  });

  socket.on("attack", async (data) => {
    await attackEvent(redis, io, socket, data);
  });

  socket.on("endTurn", async (data) => {
    await endTurnEvent(redis, io, socket, data);
  });
});
