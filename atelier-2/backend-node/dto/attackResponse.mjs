export class AttackResponse
{
  constructor(attackerId, defenderId, actionPointAttacker, defenderCardId, defenderCardHp)
  {
    this.attackerId = attackerId;
    this.defenderId = defenderId;
    this.actionPointAttacker = actionPointAttacker;
    this.defenderCardId = defenderCardId;
    this.defenderCardHp = defenderCardHp;
  }

    toJson() {
        return JSON.stringify(this);
    }
}