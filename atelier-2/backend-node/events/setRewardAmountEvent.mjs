import { GAME_HASH } from "../utils/constants.mjs";

/**
 * Handles the event to set the reward amount for a game.
 *
 * @async
 * @function setRewardAmountEvent
 * @param {Object} redis - The Redis client instance used for interacting with the database.
 * @param {Object} io - The Socket.IO server instance for emitting events.
 * @param {Object} socket - The specific Socket.IO client connection.
 * @param {Object} data - The data payload for the event.
 * @param {string} data.gameId - The unique identifier of the game.
 * @param {number} data.rewardAmount - The reward amount to set for the game.
 * @returns {Promise<void>} Resolves when the event has been handled successfully.
 */
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