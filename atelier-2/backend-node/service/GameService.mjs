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
        console.log("[GameService] Set or update game in Redis");
        await this.redis.hset(GAME_HASH, idGame, JSON.stringify(gameModel));
    }

    /**
     * Récupère le modèle de jeu depuis Redis en utilisant l'ID du jeu.
     *
     * @param {string} idGame - L'ID unique de la partie à récupérer depuis Redis.
     * @returns {Object} - Le modèle de jeu récupéré de Redis.
     */
    async getGameInRedis(idGame) {
        console.log(`[GameService] Get game in Redis for ID ${idGame}`);
        const gameModel = await this.redis.hget(GAME_HASH, idGame);

        return JSON.parse(gameModel);
    }

    async getGameIdByUserIdInRedis(userId) {
        console.log(`getGameIdByUserIdInRedis dans redis : userId=${userId}`);

        const keys = await this.redis.hgetall(GAME_HASH);

        for (const [key, value] of Object.entries(keys)) {
            const gameData = JSON.parse(value);
            // Vérifier si l'utilisateur correspond à user1 ou user2
            if (
                (gameData.user1 && gameData.user1.userId === parseInt(userId)) ||
                (gameData.user2 && gameData.user2.userId === parseInt(userId))
            ) {
                return gameData;
            }
        }
        return null;
    }

    async getGameIdByCardIdInRedis(cardPlayerId, cardOpponentId){
        const keys = await this.redis.keys(GAME_HASH);

        const getGame = async (key) => {
            const games = Object.values(await this.redis.hgetall(key))
            return games.map(game => JSON.parse(game));
        }

        const games = (await Promise.all(keys.map(getGame)))
            .concat()
            .flat()

        for (const game of games) {
            const currentPlayer = game.userTurn === game.user1.userId ? game.user1 : game.user2;
            const opponentPlayer = game.userTurn === game.user1.userId ? game.user2 : game.user1;

            if (currentPlayer.cards.some(card => card.id === cardPlayerId) || opponentPlayer.cards.some(card => card.id === cardOpponentId)) {
                return game;
            }
        }

        return null;
    }


    async deleteGameInRedisByUserId(userId){
        const gameId = await this.getGameIdByUserIdInRedis(userId);
        console.log(`Id de la game ${gameId} à supprimer de Redis`);

        await this.redis.hdel(GAME_HASH,gameId);
        console.log(`Game ${gameId} supprimé de Redis`);
        const test = await this.redis.hgetall(GAME_HASH);
        console.log("test : "+JSON.stringify(test));
    }

}