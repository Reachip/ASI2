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
            this.game.user1.actionPoint = actionPoint;
        } else if (this.game.user2.userId === playerId) {
            this.game.user2.actionPoint = actionPoint;
        }
        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setTurn(playerId) {
        console.log('[GameUpdater] Setting turn for player:', playerId);
        this.game.user1.isTurn = this.game.user1.userId === playerId;
        this.game.user2.isTurn = this.game.user2.userId === playerId;

        console.log('[GameUpdater] Turn status:', {
            user1: { id: this.game.user1.userId, isTurn: this.game.user1.isTurn },
            user2: { id: this.game.user2.userId, isTurn: this.game.user2.isTurn }
        });

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