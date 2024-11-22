import {GameModel} from "../RedisModel/GameModel.mjs";
import {GAME_HASH} from "../utils/constants.mjs";

export class GameModelService {

    constructor(redis) {
        this.redis = redis;
    }


    async createGameModel(idGame, roomId,  firstPlayer, secondPlayer, userTurn){
        console.log(`Création GameModel : idGame=${idGame}, roomId=${roomId}, firstPlayer=${JSON.stringify(firstPlayer)}, secondPlayer= ${JSON.stringify(secondPlayer)}, userTurn=${userTurn}`);

        const gameModel = new GameModel(idGame, roomId,100, firstPlayer, secondPlayer,userTurn);
        console.log("gameModel crée : "+JSON.stringify(gameModel));

        await this.setGameModel(idGame, gameModel);
    }

    async setGameModel(idGame,gameModel){
        console.log(`setGameModel dans redis : idGame=${idGame}, gameModel=${JSON.stringify(gameModel)}`);
        await this.redis.hset(GAME_HASH,idGame, gameModel);
    }

    async getGameModel(idGame){
        console.log(`getGameModel dans redis : idGame=${idGame}`);
        const gameModel = await this.redis.hget(GAME_HASH,idGame);
        console.log(`GameModel récupéré : ${JSON.stringify(gameModel)}`);

        return gameModel;
    }

}