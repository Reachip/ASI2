import {GameService} from "../service/GameService.mjs";
import GameUpdater from "../game/GameUpdater.mjs";
import {notifyRoom} from "./notifyEvent.mjs";
import {NOTIFY_ATTACK_RESPONSE, NOTIFY_END_TURN} from "../utils/constants.mjs";

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
    const service = new GameService(redis)
    const game = await service.getGameIdByUserIdInRedis(data.userId)

    console.log('[AttackEvent] Retrieved game:', game);

    const currentUser = game.user1 === data.userId ? game.user1 : game.user2
    const opponent = game.user1 === data.userId ? game.user2 : game.user1

    const gameUpdater = new GameUpdater(redis, game)

    await gameUpdater.setActionPoint(data.userId, currentUser.actionPoint + 1)
    await gameUpdater.setTurn(opponent.userId)

    notifyRoom(io, game.roomId, NOTIFY_END_TURN, gameUpdater.get());
}

export default endTurnEvent;