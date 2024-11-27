import {GameService} from "../service/GameService.mjs";
import GameUpdater from "./GameUpdater.mjs";


class GameLifecycle {
    constructor(game, cardPlayerId, cardOpponentId, redis) {
        this.service = new GameService(redis)
        this.game = new GameUpdater(redis, game)

        this.currentCardPlayerId = cardPlayerId
        this.opponentCardPlayerId = cardOpponentId;

    }

    _getOpponentCard(cardOpponentId) {
        const game = this.game.get()

        if (game.user1.isTurn) {
            return game.user2.cards.find(card => card.id === cardOpponentId)
        }

        return game.user1.cards.find(card => card.id === cardOpponentId)
    }

    _getOpponentCards() {
        const game = this.game.get()

        if (game.user1.isTurn) {
            return game.user2.cards
        }

        return game.user1.cards
    }

    _getCurrentPlayerCard(cardPlayerId) {
        const game = this.game.get()

        if (game.user1.isTurn) {
            return game.user1.cards.find(card => card.id === cardPlayerId)
        }

        return game.user2.cards.find(card => card.id === cardPlayerId)
    }

    _getCurrentAndOpponentPlayer() {
        const game = this.game.get()

        if (game.user1.isTurn) {
            return {current: game.user1, opponent: game.user2}
        }

        return {current: game.user2, opponent: game.user1}
    }

    async attack() {
        const cardAttack = this._getCurrentPlayerCard(this.currentCardPlayerId)
        const cardToAttack = this._getOpponentCard(this.opponentCardPlayerId)

        if (cardAttack.hp === 0){
            throw new Error("Error: you can't attack this card");
        }

        const damage = Math.max(0,  cardAttack.attack - cardToAttack.defence);

        cardToAttack.hp = Math.max(0, cardToAttack.hp - damage);
        await this.game.setCard(cardToAttack.id, cardToAttack)
    }

    async updateActionPoint(){
        const currentPlayer = this.getCurrentPlayer()
        const remainingPoint = currentPlayer.actionPoint--;

        await this.game.setActionPoint(currentPlayer.userId, remainingPoint)
        console.debug(this.game.get())

        if (currentPlayer.actionPoint <= 0) {
            await this.game.setTurn(this.getOpponentPlayer().userId)
            console.debug(this.game.get())
        } else {
            await this.game.setTurn(this.getCurrentPlayer().userId)
        }
    }

    isFinish() {
        return this._getOpponentCards().every(card => card.hp <= 0)
    }

    getGame() {
        return this.game.get()
    }

    getOpponentPlayer() {
        const {_, opponent} = this._getCurrentAndOpponentPlayer()
        return opponent
    }

    getCurrentPlayer() {
        const {current, _} = this._getCurrentAndOpponentPlayer()
        return current
    }
}

export default GameLifecycle;
