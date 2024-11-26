export class AttackResponse
{
  constructor(attackerId, defenderId, actionPointAttacker, defenderCardId, defenderCardHp, userTurn)
  {
    this.attackerId = attackerId;
    this.defenderId = defenderId;
    this.actionPointAttacker = actionPointAttacker;
    this.defenderCardId = defenderCardId;
    this.defenderCardHp = defenderCardHp;
    this.userTurn = userTurn;
  }

    toJson() {
        return JSON.stringify(this);
    }
}