export class GameModel
{
    constructor(gameId, rewardAmount, user1Id, user2Id,listCards1, listCards2,userTurn = 1,actionPoint=1)
    {
        this.gameId = gameId;
        this.rewardAmount = rewardAmount;
        this.user1 = {
            isTurn: userTurn === 1,
            userId: user1Id,
            cards: listCards1,
            actionPoint: actionPoint
        };
        this.user2 = {
            isTurn: userTurn === 2,
            userId: user2Id,
            cards: listCards2,
            actionPoint: actionPoint
        };
    }

    toJson()
    {
        return JSON.stringify(this);
    }
}

/* Format of the gameData object in Redis:

const gameData = 
{
    gameId: 1,
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