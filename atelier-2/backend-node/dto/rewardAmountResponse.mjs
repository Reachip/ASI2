export class RewardAmountResponse 
{
    constructor(rewardAmount) 
    {
        this.rewardAmount = rewardAmount;
    }

    toJson() 
    {
        return JSON.stringify(this);
    }
}