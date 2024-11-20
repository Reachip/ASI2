import { GAME_HASH } from "../utils/constants.mjs";

// data : {gameId, rewardAmount}
const setRewardAmountEvent = async (redis, io, socket, data) => {
    if (data === undefined || data === null)
    {
        return console.log("Error: gameId and rewardAmount are required.");
    }

    const gameId = data.gameId;
    const rewardAmount = data.rewardAmount;

    const game = await redis.hget(GAME_HASH, gameId);
    if (!game)
    {
        return console.log("Error: Game not found.");
    }

    const gameData = JSON.parse(game);
    gameData.rewardAmount = rewardAmount;
    
    await redis.hset(GAME_HASH, gameId, JSON.stringify(gameData));

    io.to(gameId).emit("rewardAmountUpdated", { rewardAmount });
}

export default setRewardAmountEvent;