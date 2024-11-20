import { GAME_HASH } from "../utils/constants.mjs";

/**
 * Handles the event to end a player's turn in a game.
 *
 * @async
 * @function endTurnEvent
 * @param {Object} redis - The Redis client instance used for interacting with the database.
 * @param {Object} io - The Socket.IO server instance for emitting events.
 * @param {Object} socket - The specific Socket.IO client connection.
 * @param {Object} data - The data payload for the event.
 * @param {string} data.gameId - The unique identifier of the game.
 * @param {string} data.userId - The unique identifier of the user ending their turn.
 * @returns {Promise<void>} Resolves when the turn-ending logic has been processed successfully.
 */
const endTurnEvent = async (redis, io, socket, data) => {
    // End turn event logic : no attack, no card played, just end the turn and add one action point to player

    if (data === undefined || data === null)
    {
        return console.log("Error: gameId and userId are required.");
    }

    const gameId = data.gameId;
    const userId = data.userId;

    const game = await redis.hget(GAME_HASH, gameId);

    if (!game)
    {
        return console.log("Error: Game not found.");
    }

    const gameData = JSON.parse(game);

    // Get current player :
    const currentPlayer = gameData.userGameMaster.userId === userId ? gameData.userGameMaster : gameData.user2;

    if (!currentPlayer)
    {
        return console.log("Error: Current player not found.");
    }

    currentPlayer.actionPoint += 1;

    await redis.hset(GAME_HASH, gameId, JSON.stringify(gameData));

    io.to(gameId).emit("turnEnded", { userId });
}

export default endTurnEvent;