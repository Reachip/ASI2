export class EndTurnResponse
{
    constructor(currentPlayerId, actionPoint)
    {
        this.currentPlayerId = currentPlayerId;
        this.actionPoint = actionPoint;
    }

    toJson()
    {
        return JSON.stringify(this);
    }
}