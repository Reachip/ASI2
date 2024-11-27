import {NOTIFY_ATTACK_RESPONSE, NOTIFY_END_FIGHT} from "../utils/constants.mjs";
import {AttackResponse} from "../dto/attackResponse.mjs";
import {notifyRoom} from "./notifyEvent.mjs";
import {GameService} from "../service/GameService.mjs";

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
    const gameService = new GameService(redis);

    if (data === undefined || data === null)
    {
        return console.log("Error: gameId, userIdAttack, cardIdToAttack and cardAttackId are required.");
    }

    const {cardPlayerId, cardOpponentId} = data;

    const gameData = await gameService.getGameIdByCardIdInRedis(cardPlayerId, cardOpponentId)

    if (!gameData)
    {
        return console.log("Error: Game not found.");
    }

    const [currentPlayer, opponentPlayer] = getCurrentAndOpponentPlayer(gameData);

    try {
        const allCards = [currentPlayer.cards, opponentPlayer.cards].concat().flat()

        const cardAttack = allCards.find(card => card.id === cardPlayerId)
        const cardToAttack = allCards.find(card => card.id === cardOpponentId)

        const remainingHp = processAttack(cardAttack, cardToAttack);
        cardToAttack.hp = remainingHp;

        const userTurn = updateActionPoint(currentPlayer, opponentPlayer);

        await gameService.setGameInRedis(gameData.gameId, gameData);

        if (areAllCardsOutOfPv(opponentPlayer.cards)){
            console.log(`Le joueur ${currentPlayer.id} à gagner contre ${opponentPlayer.id}`)
            notifyRoom(io, gameData.roomId,NOTIFY_END_FIGHT, {'winner': currentPlayer.id});
        }

        else {
            const attackResponse = new AttackResponse(currentPlayer.id, opponentPlayer.id, currentPlayer.actionPoint, cardIdToAttack, remainingHp, userTurn);
            notifyRoom(io, gameData.roomId,NOTIFY_ATTACK_RESPONSE, attackResponse.toJson());
        }

    } catch (error) {
        return console.log(`Error: ${error.message}`);
    }
}


function getCurrentAndOpponentPlayer(gameData) {
    if (gameData.user1.isTurn) {
        return [gameData.user1, gameData.user2];
    } else {
        return [gameData.user2, gameData.user1];
    }
}

function validateTurnAndActionPoints(currentPlayer, userIdAttack) {
    if (currentPlayer.userId !== userIdAttack) {
        throw new Error("It is not the turn of this player.");
    }
    if (currentPlayer.actionPoint <= 0) {
        throw new Error("Not enough action points.");
    }
}

/**
 * Recherche une carte par son ID dans une collection de cartes.
 *
 * @param {Array} cards - Liste des cartes.
 * @param {string} cardId - ID de la carte à rechercher.
 * @returns {Object} - La carte trouvée.
 * @throws {Error} - Si la carte n'est pas trouvée.
 */
function findCard(cards, cardId) {
    const card = cards.find(card => card.id === cardId);

    if (!card) {
        throw new Error(`Card with ID "${cardId}" not found.`);
    }

    return card;
}

function processAttack (cardAttack, cardToAttack){
    if (cardToAttack.hp === 0){
        throw new Error("Error: you can't attack this card");
    }
    const damage = Math.max(0, cardAttack.attack - cardToAttack.defence);
    return Math.max(0, cardToAttack.hp - damage);
}

function updateActionPoint(currentPlayer, opponentPlayer){
    currentPlayer.actionPoint--;
    if (currentPlayer.actionPoint <= 0) {
        currentPlayer.isTurn = false;
        opponentPlayer.isTurn = true;

        return opponentPlayer.id
    }
    else return currentPlayer.id
}

function areAllCardsOutOfPv(cards) {
    return cards.every(card => card.hp <= 0);
}

export default attackEvent;