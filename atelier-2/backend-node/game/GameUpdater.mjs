import {GameService} from "../service/GameService.mjs";
class GameUpdater {
    constructor(redis, game) {
        console.log('[GameUpdater] Initializing with game:', game);
        this.game = game;
        this.service = new GameService(redis);
    }

    async setCard(cardId, newCard) {
        console.log('[GameUpdater] Setting card:', { cardId, newCard });
        for (let user of [this.game.user1, this.game.user2]) {
            const cardIndex = user.cards.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                user.cards[cardIndex] = newCard;
                console.log('[GameUpdater] Updated card for user:', user.userId);
                break;
            }
        }
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setActionPoint(playerId, actionPoint) {
        console.log('[GameUpdater] Setting action point:', { playerId, actionPoint });
        if (this.game.user1.userId === playerId) {
            this.game.user1.actionPoints = actionPoint;
        } else if (this.game.user2.userId === playerId) {
            this.game.user2.actionPoints = actionPoint;
        }
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setAttackLabel(attackLabel) {
        this.game.attackLabel = attackLabel
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setTurn(playerId) {
        console.log('[GameUpdater] Setting turn for player:', playerId);
        this.game.userTurn = playerId;

        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async get() {
        console.log('[GameUpdater] Getting game:', this.game.gameId);
        const game = await this.service.getGameInRedis(this.game.gameId);
        console.log('[GameUpdater] Retrieved game state:', game);
        return game;
    }
}

export default GameUpdater;