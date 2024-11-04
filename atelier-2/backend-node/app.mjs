import UserRepository from "./repository/UserRepository.mjs";
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({"ping": "pong"})
});

app.listen(9000);
