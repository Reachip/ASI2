import { GameModel } from "../RedisModel/GameModel.mjs";
import { GAME_HASH } from "../utils/constants.mjs";

export class GameService {

    constructor(redis) {
        this.redis = redis;
    }

    /**
     * Crée une nouvelle partie puis enregistre le modèle de jeu dans Redis.
     *
     * @param {string} idGame - L'ID unique de la partie à créer.
     * @param {string} roomId - L'ID de la salle de jeu.
     * @param {Object} firstPlayer - Le premier joueur avec ses informations (et ses cartes).
     * @param {Object} secondPlayer - Le deuxième joueur avec ses informations (et ses cartes).
     * @param {string} userTurn - Le joueur dont c'est le tour de jouer.
     */
    async createGame(idGame, roomId, firstPlayer, secondPlayer, userTurn) {
        console.log(`Création GameModel : idGame=${idGame}, roomId=${roomId}, firstPlayer=${JSON.stringify(firstPlayer)}, secondPlayer= ${JSON.stringify(secondPlayer)}, userTurn=${userTurn}`);

        const gameModel = new GameModel(idGame, roomId, 100, firstPlayer, secondPlayer, userTurn);
        console.log("gameModel crée : " + JSON.stringify(gameModel));

        await this.setGameInRedis(idGame, gameModel);
    }

    /**
     * Enregistre le modèle de jeu dans Redis sous une clé spécifique à la partie.
     *
     * @param {string} idGame - L'ID unique de la partie à enregistrer.
     * @param {Object} gameModel - Le modèle de jeu à enregistrer dans Redis.
     */
    async setGameInRedis(idGame, gameModel) {
        console.log(`setGameModel dans redis : idGame=${idGame}, gameModel=${JSON.stringify(gameModel)}`);
        await this.redis.hset(GAME_HASH, idGame, gameModel);
    }

    /**
     * Récupère le modèle de jeu depuis Redis en utilisant l'ID du jeu.
     *
     * @param {string} idGame - L'ID unique de la partie à récupérer depuis Redis.
     * @returns {Object} - Le modèle de jeu récupéré de Redis.
     */
    async getGameInRedis(idGame) {
        console.log(`getGameModel dans redis : idGame=${idGame}`);
        const gameModel = await this.redis.hget(GAME_HASH, idGame);
        console.log(`GameModel récupéré : ${JSON.stringify(gameModel)}`);

        return JSON.parse(gameModel);
    }

    async getGameIdByUserIdInRedis(userId){
        console.log(`getGameIdByUserIdInRedis dans redis : userId=${userId}`);
        const keys = await this.redis.keys(GAME_HASH);

        for (const key of keys) {
            const gameData = JSON.parse(await this.redis.get(key));
            if (
                (gameData.user1 && gameData.user1.userId === userId) ||
                (gameData.user2 && gameData.user2.userId === userId)
            ) {
                return gameData.gameId;
            }
        }
        return null;
    }



    async updateGameInRedis(idGame, gameModel){
        console.log(`setGameModel dans redis : idGame=${idGame}, gameModel=${JSON.stringify(gameModel)}`);
        await this.redis.hset(GAME_HASH,idGame, gameModel);
    }


}