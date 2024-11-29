
export class GameTransactionDTO  {
    constructor(gameId, user1Id, user2Id, moneyOperation1, moneyOperation2)
    {
        this.gameId = gameId;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.moneyOperation1 = moneyOperation1;
        this.moneyOperation2 = moneyOperation2;
    }
}
