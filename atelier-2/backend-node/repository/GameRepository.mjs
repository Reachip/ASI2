export class GameRepository {
    /**
     * Initialise le repository avec l'URL de base.
     */
    constructor() {
        this.url = 'http://localhost:8088/game/';
    }

    /**
     * Récupère un jeu par son ID.
     *
     * @param {number} id - L'identifiant unique du jeu.
     * @returns {Promise<Object>} Un objet contenant les détails du jeu.
     * @throws {Error} Si le jeu n'est pas trouvé ou en cas d'échec de la requête.
     *
     * @example
     * const repository = new GameRepository();
     * repository.getGame(1)
     *     .then(game => console.log(game))
     *     .catch(error => console.error(error));
     */
    async getGame(id) {
        const response = await fetch(`${this.url}${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch game with ID ${id}: ${response.statusText}`);
        }
        return await response.json();
    }

    /**
     * Crée un nouveau jeu avec les informations fournies.
     *
     * @param {Object} gameCreationRequest - Les informations nécessaires pour créer un jeu.
     * @param {number} gameCreationRequest.user1Id - ID du premier joueur.
     * @param {number} gameCreationRequest.user2Id - ID du second joueur.
     * @param {number} gameCreationRequest.gameMasterId - ID du maître de jeu (doit être un des joueurs).
     * @param {number[]} gameCreationRequest.deck1CardIds - IDs des cartes sélectionnées par le joueur 1.
     * @param {number[]} gameCreationRequest.deck2CardIds - IDs des cartes sélectionnées par le joueur 2.
     * @returns {Promise<Object>} Un objet contenant les détails du jeu créé.
     * @throws {Error} Si la requête échoue ou si le payload est invalide.
     *
     * @example
     * const repository = new GameRepository();
     * const gameCreationRequest = {
     *     user1Id: 1,
     *     user2Id: 2,
     *     gameMasterId: 1,
     *     deck1CardIds: [101, 102],
     *     deck2CardIds: [201, 202],
     * };
     * repository.createGame(gameCreationRequest)
     *     .then(createdGame => console.log(createdGame))
     *     .catch(error => console.error(error));
     */
    async createGame(gameCreationRequest) {
        const response = await fetch(`${this.url}create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameCreationRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to create game: ${response.statusText} - ${errorMessage}`);
        }
        return await response.json();
    }

    /**
     * Récupère l'historique des jeux en fonction des filtres fournis.
     *
     * @param {Object} [filters={}] - Filtres optionnels pour l'historique des jeux.
     * @param {number} [filters.receiverId] - ID du joueur receveur.
     * @param {number} [filters.emitterId] - ID du joueur émetteur.
     * @param {number} [filters.roomId] - ID de la salle de jeu.
     * @returns {Promise<Object[]>} Une liste d'objets contenant l'historique des jeux correspondant aux filtres.
     * @throws {Error} Si la requête échoue.
     *
     * @example
     * const repository = new GameRepository();
     * repository.getGameHistory({ receiverId: 1, emitterId: 2 })
     *     .then(history => console.log(history))
     *     .catch(error => console.error(error));
     */
    async getGameHistory({ receiverId, emitterId, roomId } = {}) {
        const queryParams = new URLSearchParams();
        if (receiverId) queryParams.append('receiverId', receiverId);
        if (emitterId) queryParams.append('emitterId', emitterId);
        if (roomId) queryParams.append('roomId', roomId);

        const response = await fetch(`${this.url}history?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch game history: ${response.statusText}`);
        }
        return await response.json();
    }
}
