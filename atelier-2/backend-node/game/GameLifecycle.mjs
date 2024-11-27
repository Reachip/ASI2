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
            return {current: game.user1, oppenent: game.user2}
        }

        return {current: game.user2, oppenent: game.user1}
    }

    async attack() {
        const cardAttack = this._getCurrentPlayerCard(this.currentCardPlayerId)
        const cardToAttack = this._getOpponentCard(this.opponentCardPlayerId)

        if (cardAttack.hp === 0){
            throw new Error("Error: you can't attack this card");
        }

        const damage = Math.max(0,  cardAttack.attack - cardToAttack.defence);

        this.cardToAttack.hp = Math.max(0, cardToAttack.hp - damage);
        await this.game.setCard(cardToAttack.id, cardToAttack)
    }

    async updateActionPoint(){
        const currentPlayer = this.getCurrentPlayer()
        const remainingPoint = currentPlayer.actionPoint--;

        await this.game.setActionPoint(currentPlayer.id, remainingPoint)
        console.debug(this.game.get())

        if (this.currentPlayer.actionPoint <= 0) {
            await this.game.setTurn(this.getOppenentPlayer().id)
            console.debug(this.game.get())
        }
    }

    async isFinish() {
        if (this._getOpponentCards().every(card => card.hp <= 0)) {
            console.log(`Le joueur ${this.opponentPlayer.id} à gagné contre ${this.opponentPlayer.id}`)
            return true
        }

        return false
    }

    getGame() {
        return this.game.get()
    }

    getOppenentPlayer() {
        const {_, oppenent} = this._getCurrentAndOpponentPlayer()
        return oppenent
    }

    getCurrentPlayer() {
        const {current, _} = this._getCurrentAndOpponentPlayer()
        return current
    }
}

export default GameLifecycle;
