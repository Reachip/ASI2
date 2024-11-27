import {GameService} from "../service/GameService.mjs";

class GameUpdater {
    constructor(redis, game) {
        this.game = game;
        this.service = new GameService(redis)
    }

    async setCard(cardId, newCard) {
        // Modifier l'objet en appliquant la nouvelle carte
        // ...

        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setActionPoint(playerId, actionPoint) {
        // Modifier l'objet joueur en appliquant actionPoint = actionPoint au joueur en question
        // ...

        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    async setTurn(playerId) {
        // Modifier l'objet en appliquant turn = true au joueur en question
        // ...

        await this.service.setGameInRedis(this.game.gameId, this.game);
    }

    get() {
        return this.game;
    }
}


export default GameUpdater;