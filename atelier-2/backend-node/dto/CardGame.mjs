
export class CardGame
{
    constructor(card)
    {
        this.id = card.id;
        this.name= card.name;
        this.imgUrl = card.imgUrl;
        this.energy = card.energy;
        this.hp = card.hp;
        this.defence = card.defence;
        this.attack =  card.attack;
    }

    toJson()
    {
        return JSON.stringify(this);
    }
}