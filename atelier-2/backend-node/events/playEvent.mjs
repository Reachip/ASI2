import {
    NOTIFY_NOT_ENOUGH_CARD_EVENT,
    NOTIFY_ROOM_FIGHT_CREATED_EVENT, NOTIFY_ROOM_PLAY_CANCEL,
    TYPE_ROOM, USER_ROOMS_HASH,
    WAITLIST_FIGHT_HASH
} from "../utils/constants.mjs";
import {notifyRoom, notifyUser} from "./notifyEvent.mjs";
import {createRoom} from "../utils/roomUtils.mjs";
import {UserRepository} from "../repository/UserRepository.mjs";
import {GameRepository} from "../repository/GameRepository.mjs";
import {addInRedis, getDetailsUserById, logDetailsRedis} from "../utils/redisUtils.mjs";
import RetryPlayQueue from "../service/RetryPlayQueue.mjs";
import {GameService} from "../service/GameService.mjs";
import {CardService} from "../service/CardService.mjs";
import {CardGame} from "../dto/CardGame.mjs";

const userRepository = new UserRepository();
const gameRepository = new GameRepository();
const cardService = new CardService();

export const playEvent = async (redis, io, data) => {
    try {
        const { id, cards } = data;

        const listCards = await userRepository.getUserCards(id);
        console.log(`Liste des cartes de l'utilisateur (${id} récupérée :`, listCards);

        if (cards.length !== 5) {
            console.error("L'utilisateur doit pouvoir jouer avec cinq cartes");
            return;
        }

        if (!cards.every(userCard => listCards.map(card => card.id).includes(userCard))) {
            console.error("L'utilisateur ne peut pas jouer avec ces cartes");
            return;
        }

        const retryPlayQueue = new RetryPlayQueue(redis, id)
        await retryPlayQueue.init()

        const existingQueue = (await redis.lrange(WAITLIST_FIGHT_HASH, 0, -1)).map(player => JSON.parse(player));

        if (!existingQueue.some(player => player.id === id)) {
            await redis.rpush(WAITLIST_FIGHT_HASH, JSON.stringify(data));
        }

        while (await retryPlayQueue.shouldStopSearchingPlayer() || await redis.llen(WAITLIST_FIGHT_HASH) < 2) {
            const retryFlag = await retryPlayQueue.get()

            if (retryFlag !== 'true') {
                console.log(`Le retryFlag pour l'utilisateur ${id} est passé à false. Arrêt de la boucle.`);
                return;
            }

            console.log("Moins de deux joueurs dans la liste d'attente. Nouvelle tentative dans 2000ms...");
            await new Promise(resolve => setTimeout(resolve, 2000)); // Attente de deux secondes avant nouvel essai
        }

        await retryPlayQueue.delete()

        console.log(`L'utilisateur ${id} possède bien au moins 5 cartes : ${cards.length}`);
        console.log("Il y a au moins deux personnes dans la liste d'attente.");

        const [firstPlayer, secondPlayer] = (await redis.lrange(WAITLIST_FIGHT_HASH, 0, 1)).map(player => JSON.parse(player));
        await redis.ltrim(WAITLIST_FIGHT_HASH, 2, -1);

        [new RetryPlayQueue(redis, firstPlayer.id), new RetryPlayQueue(redis, secondPlayer.id)].forEach(retryPlayQueue => {
            retryPlayQueue.delete()
        })

        console.log("Les deux premières personnes sont :", firstPlayer, secondPlayer);

        const detailsUser1 = await getDetailsUserById(redis, firstPlayer.id);
        const detailsUser2 = await getDetailsUserById(redis, secondPlayer.id);

        console.log(`detailsUser1 : ${detailsUser1}`);
        console.log(`detailsUser2 : ${detailsUser2}`);

        firstPlayer.username = detailsUser1.username;
        secondPlayer.username = detailsUser2.username;

        const userSocket1 = await io.sockets.sockets.get(detailsUser1.socketId);
        const userSocket2 = await io.sockets.sockets.get(detailsUser2.socketId);

        const roomId = createRoom(io, TYPE_ROOM.FIGHT, firstPlayer.id, secondPlayer.id, userSocket1, userSocket2);
        await logDetailsRedis(io,redis);

        await addInRedis(redis, USER_ROOMS_HASH, firstPlayer.id, roomId);
        await addInRedis(redis, USER_ROOMS_HASH, secondPlayer.id, roomId);

        const randomValue = Math.floor(Math.random() * 2) + 1;

        const [userId1, userId2] = [Math.min(firstPlayer.id, secondPlayer.id), Math.max(firstPlayer.id, secondPlayer.id)];

        const gameCreationRequest = {user1Id: userId1, user2Id: userId2};

        await gameRepository.createGame(gameCreationRequest)
            .then(async (createdGame) => {
                console.log("Id de la game : " + JSON.stringify(createdGame));

                // Récupère les cartes et crée des instances de CardGame
                const listCardsFirstPlayer = await cardService.getCardsById(firstPlayer.cards);
                const listCardsSecondPlayer = await cardService.getCardsById(secondPlayer.cards);

                // Transforme les listes en instances de CardGame
                const cardGamesFirstPlayer = listCardsFirstPlayer.map((card) => new CardGame(card));
                const cardGamesSecondPlayer = listCardsSecondPlayer.map((card) => new CardGame(card));

                firstPlayer.cards = cardGamesFirstPlayer;
                secondPlayer.cards = cardGamesSecondPlayer;

                const gameService = new GameService(redis);
                await gameService.createGame(createdGame, roomId, firstPlayer, secondPlayer, randomValue == 1 ? firstPlayer.id : secondPlayer.id);

                const payload = {
                    'gameId': createdGame,
                    'player1': firstPlayer,
                    'player2': secondPlayer,
                    'userTurn': randomValue == 1 ? firstPlayer.id : secondPlayer.id
                }
                notifyRoom(io, roomId, NOTIFY_ROOM_FIGHT_CREATED_EVENT, payload);
            })
            .catch(error => console.error('Error creating game:' + error));
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}