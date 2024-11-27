import {GameService} from "../service/GameService.mjs";
import GameUpdater from "./GameUpdater.mjs";

class GameLifecycle {
    constructor(game, cardPlayerId, cardOpponentId, redis) {
        console.log('[GameLifecycle] Initializing with:', { cardPlayerId, cardOpponentId });
        this.service = new GameService(redis)
        this.game = new GameUpdater(redis, game)
        this.currentCardPlayerId = cardPlayerId
        this.opponentCardPlayerId = cardOpponentId;
    }

    async _getOpponentCard(cardOpponentId) {
        console.log('[GameLifecycle] Getting opponent card:', cardOpponentId);
        const game = await this.game.get()
        const card = game.user1.userId == game.userTurn ? game.user2.cards.find(card => card.id === cardOpponentId) : game.user1.cards.find(card => card.id === cardOpponentId);
        console.log('[GameLifecycle] Found opponent card:', card);
        return card;
    }

    async _getOpponentCards() {
        console.log('[GameLifecycle] Getting all opponent cards');
        const game = await this.game.get()
        const cards = game.user1.userId == game.userTurn ? game.user2.cards : game.user1.cards;
        console.log('[GameLifecycle] Found opponent cards:', cards);
        return cards;
    }

    async _getCurrentPlayerCard(cardPlayerId) {
        console.log('[GameLifecycle] Getting current player card:', cardPlayerId);
        const game = await this.game.get()
        const card = game.user1.userId == game.userTurn ? game.user1.cards.find(card => card.id === cardPlayerId) : game.user2.cards.find(card => card.id === cardPlayerId);
        console.log('[GameLifecycle] Found current player card:', card);
        return card;
    }

    async _getCurrentAndOpponentPlayer() {
        console.log('[GameLifecycle] Getting current and opponent players');
        const game = await this.game.get()
        const players = game.user1.id == game.userTurn ? {current: game.user1, opponent: game.user2} : {current: game.user2, opponent: game.user1};
        console.log('[GameLifecycle] Players:', players);
        return players;
    }

    async attack() {
        const attackLabel = {}
        console.log('[GameLifecycle] Initiating attack');

        const cardAttack = await this._getCurrentPlayerCard(this.currentCardPlayerId)
        const cardToAttack = await this._getOpponentCard(this.opponentCardPlayerId)

        console.log('[GameLifecycle] Attack details:', { cardAttack, cardToAttack })


        if (cardAttack.hp === 0){
            console.error('[GameLifecycle] Attack failed: card has 0 HP');
            throw new Error("Error: you can't attack this card");
        }

        attackLabel.pvAvant = cardAttack.hp

        const damage = Math.max(0, cardAttack.attack - cardToAttack.defence)
        cardToAttack.hp = Math.max(0, cardToAttack.hp - damage);

        attackLabel.pvApres = cardAttack.hp

        attackLabel.cardToAttack = cardToAttack
        attackLabel.cardAttack = cardAttack

        attackLabel.currentCardPlayerId = this.currentCardPlayerId
        attackLabel.opponentCardPlayerId = this.opponentCardPlayerId

        console.log('[GameLifecycle] Attack result:', { damage, updatedCard: cardToAttack })

        await this.game.setAttackLabel(attackLabel)
    }

    async updateActionPoint(){
        console.log('[GameLifecycle] Updating action points');
        const currentPlayer = await this.getCurrentPlayer()
        const remainingPoint = currentPlayer.actionPoint--;
        console.log('[GameLifecycle] Remaining action points:', remainingPoint);

        await this.game.setActionPoint(currentPlayer.userId, remainingPoint)
        console.log('[GameLifecycle] Updated game state:', await this.game.get())

        if (currentPlayer.actionPoint <= 0) {
            console.log('[GameLifecycle] No action points left, switching turn to opponent');
            await this.game.setTurn((await this.getOpponentPlayer()).userId)
            console.debug('[GameLifecycle] New game state:', await this.game.get())
        } else {
            console.log('[GameLifecycle] Maintaining current player turn');
            await this.game.setTurn((await this.getCurrentPlayer()).userId)
        }
    }

    async isFinish() {
        const opponentCards = await this._getOpponentCards();
        const isFinished = opponentCards.every(card => card.hp <= 0);
        console.log('[GameLifecycle] Checking game finish status:', isFinished);
        return isFinished;
    }

    async getGame() {
        console.log('[GameLifecycle] Getting game state');
        const game = await this.game.get();
        console.log('[GameLifecycle] Current game state:', game);
        return game;
    }

    async getOpponentPlayer() {
        console.log('[GameLifecycle] Getting opponent player');
        const {_, opponent} = await this._getCurrentAndOpponentPlayer()
        console.log('[GameLifecycle] Opponent player:', opponent);
        return opponent
    }

    async getCurrentPlayer() {
        console.log('[GameLifecycle] Getting current player');
        const {current, _} = await this._getCurrentAndOpponentPlayer()
        console.log('[GameLifecycle] Current player:', current);
        return current
    }
}

export default GameLifecycle;