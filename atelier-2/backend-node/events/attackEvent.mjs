import {NOTIFY_ATTACK_RESPONSE, NOTIFY_END_FIGHT, NOTIFY_ERROR_RESPONSE} from "../utils/constants.mjs";
import {notifyRoom} from "./notifyEvent.mjs";
import {GameService} from "../service/GameService.mjs";
import GameLifecycle from "../game/GameLifecycle.mjs";
import SaveGameTransactionActiveMq from "../activemq/SaveGameTransactionActiveMq.mjs";
import {GameTransactionDTO} from "../dto/GameTransactionDTO.mjs";


const saveGameTransactionActiveMq = new SaveGameTransactionActiveMq();
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
const attackEvent = async (redis, io, socket, data) => {
    console.log('[AttackEvent] Processing attack:', data);

    const { cardPlayerId, cardOpponentId } = data;
    const service = new GameService(redis)
    const game = await service.getGameIdByCardIdInRedis(cardPlayerId, cardOpponentId)

    try {
        console.log('[AttackEvent] Retrieved game:', game);

        const lifecycle = new GameLifecycle(game, cardPlayerId, cardOpponentId, redis)

        await lifecycle.updateActionPoint()
        await lifecycle.attack()

        const isFinished = await lifecycle.isFinish()
        console.log('[AttackEvent] Game finished status:', isFinished);

        if (isFinished) {
            const currentPlayer = await lifecycle.getCurrentPlayer()
            const opponentPlayer = await lifecycle.getOpponentPlayer()
            const gameState = await lifecycle.getGame()

            console.log('[AttackEvent] Game ended, winner:', currentPlayer.userId);
            notifyRoom(io, game.roomId, NOTIFY_END_FIGHT, {
                winner: currentPlayer.id,
                game: gameState
            });

            const gameTransactionDTO = new GameTransactionDTO(game.gameId, currentPlayer.userId, opponentPlayer.userId, 100, -100 );
            console.log('[AttackEvent] gameTransactionDTO:', gameTransactionDTO);
            await saveGameTransactionActiveMq.sendMessage(gameTransactionDTO);

        } else {
            const gameState = await lifecycle.getGame()
            console.log('[AttackEvent] Game continuing, notifying room');
            notifyRoom(io, game.roomId, NOTIFY_ATTACK_RESPONSE, gameState);
        }
    } catch (error) {
        notifyRoom(io, game.roomId, NOTIFY_ERROR_RESPONSE, {error});
    }
}

export default attackEvent;