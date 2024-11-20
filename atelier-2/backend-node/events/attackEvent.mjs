import { GAME_HASH } from "../utils/constants.mjs";

// data : {gameId, userIdAttack, cardIdToAttack, cardAttackId }
const attackEvent = async (redis, io, socket, data) => {
    if (data === undefined || data === null)
    {
        return console.log("Error: gameId, userIdAttack, cardIdToAttack and cardAttackId are required.");
    }

    const gameId = data.gameId;
    const userIdAttack = data.userIdAttack;
    const cardIdToAttack = data.cardIdToAttack;
    const cardAttackId = data.cardAttackId;

    const game = await redis.hget(GAME_HASH, gameId);
    if (!game)
    {
        return console.log("Error: Game not found.");
    }

    const gameData = JSON.parse(game);

    // Get current player :
    const currentPlayer = gameData.userGameMaster.userId === userIdAttack ? gameData.userGameMaster : gameData.user2;

    if (!currentPlayer)
    {
        return console.log("Error: Current player not found.");
    }

    if (currentPlayer.actionPoint <= 0)
    {
        return console.log("Error: Not enough action point.");
    }

    // Get opponent player :
    const opponentPlayer = gameData.userGameMaster.userId === userIdAttack ? gameData.user2 : gameData.userGameMaster;

    if (!opponentPlayer)
    {
        return console.log("Error: Opponent player not found.");
    }

    // Get current card :
    const cardAttack = currentPlayer.cards.find(card => card.cardId === cardAttackId);

    if (!cardAttack)
    {
        return console.log("Error: Card attack not found.");
    }

    // Get opponent card to attack :
    const cardToAttack = opponentPlayer.cards.find(card => card.cardId === cardIdToAttack);

    if (!cardToAttack)
    {
        return console.log("Error: Card to attack not found.");
    }

    // Attack : cardHp = cardHp - (cardAttack - cardDefense) (minimum 0)
    cardToAttack.cardCurrentHp = Math.max(0, cardToAttack.cardCurrentHp - (cardAttack.cardAttack - cardToAttack.cardDefense));

    // Update action point :
    currentPlayer.actionPoint--;

    // Update game data :
    await redis.hset(GAME_HASH, gameId, JSON.stringify(gameData));
}

export default attackEvent;



// REDIS GAME STRUCTURE :
/*

const gameData = 
{
    gameID: 1,
    rewardAmount: 100,
    userGameMaster: {
        userId: 1,
        cards: 
        [
            {
                cardId : 1,
                cardCurrentHp: 100,
                cardHp: 100,
                cardAttack: 10,
                cardDefense: 5,
                cardEnergy: 10
            },
            {
                cardId : 1,
                cardCurrentHp: 100,
                cardHp: 100,
                cardAttack: 10,
                cardDefense: 5,
                cardEnergy: 10
            }
        ],
        actionPoint : 2
    },
    user2: {
        userId: 2,
        cards:
        [
            {
                cardId : 1,
                cardCurrentHp: 100,
                cardHp: 100,
                cardAttack: 10,
                cardDefense: 5,
                cardEnergy: 10
            },
            {
                cardId : 1,
                cardCurrentHp: 100,
                cardHp: 100,
                cardAttack: 10,
                cardDefense: 5,
                cardEnergy: 10,
            }
        ],
        actionPoint : 2
    }
};

*/