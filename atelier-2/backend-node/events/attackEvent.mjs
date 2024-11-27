import {NOTIFY_ATTACK_RESPONSE, NOTIFY_END_FIGHT} from "../utils/constants.mjs";
import {notifyRoom} from "./notifyEvent.mjs";
import {GameService} from "../service/GameService.mjs";
import GameLifecycle from "../game/GameLifecycle.mjs";

/**
 * Handles the event for a player attacking with a card in a game.
 *
 * @async
 * @function attackEvent
 * @param {Object} redis - The Redis client instance used for interacting with the database.
 * @param {Object} io - The Socket.IO server instance for emitting events.
 * @param {Object} socket - The specific Socket.IO client connection.
 * @param {Object} data - The data payload for the attack event.
 * @param {string} data.gameId - The unique identifier of the game.
 * @param {string} data.userIdAttack - The unique identifier of the player initiating the attack.
 * @param {string} data.cardIdToAttack - The identifier of the target card being attacked.
 * @param {string} data.cardAttackId - The identifier of the card being used to attack.
 * @returns {Promise<void>} Resolves when the attack logic has been processed successfully.
 */

const attackEvent = async (redis, io, socket, data) => 
{
    const {cardPlayerId, cardOpponentId} = data;

    const service = new GameService(redis)
    const game = await service.getGameIdByCardIdInRedis(cardPlayerId, cardOpponentId)
    const lifecycle = new GameLifecycle(game, cardPlayerId, cardOpponentId, redis)

    await lifecycle.updateActionPoint()

    if (lifecycle.isFinish()) {
        const currentPlayer = lifecycle.getCurrentPlayer()
        notifyRoom(io, game.roomId,NOTIFY_END_FIGHT, {winner: currentPlayer.id, game: lifecycle.getGame()});
    }

    else {
        notifyRoom(io, game.roomId, NOTIFY_ATTACK_RESPONSE, lifecycle.getGame());
    }
}

export default attackEvent;