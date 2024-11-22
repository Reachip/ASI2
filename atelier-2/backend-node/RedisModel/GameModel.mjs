export class GameModel
{
    constructor(gameId, rewardAmount, userGameMasterId, user2Id, actionPoint=3)
    {
        this.gameId = gameId;
        this.rewardAmount = rewardAmount;
        this.userGameMaster = {
            userId: userGameMasterId,
            cards: [],
            actionPoint: actionPoint
        };
        this.user2 = {
            userId: user2Id,
            cards: [],
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