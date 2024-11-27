import {GameService} from "../service/GameService.mjs";

class GameUpdater {
    constructor(redis, game) {
        this.game = game;
        this.service = new GameService(redis);
    }

    async setCard(cardId, newCard) {
        for (let user of [this.game.user1, this.game.user2]) {
            const cardIndex = user.cards.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                user.cards[cardIndex] = newCard;
                break;
            }
        }
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setActionPoint(playerId, actionPoint) {
        if (this.game.user1.userId === playerId) {
            this.game.user1.actionPoint = actionPoint;
        } else if (this.game.user2.userId === playerId) {
            this.game.user2.actionPoint = actionPoint;
        }
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setTurn(playerId) {
        this.game.user1.isTurn = this.game.user1.userId === playerId;
        this.game.user2.isTurn = this.game.user2.userId === playerId;
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    get() {
        return this.game;
    }
}

export default GameUpdater;