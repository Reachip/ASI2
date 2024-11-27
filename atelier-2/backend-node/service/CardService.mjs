import {CardRepository} from "../repository/CardRepository.mjs";


const cardRepository = new CardRepository();
export class CardService {

    /**
     * Récupère les informations des cartes à partir d'une liste d'identifiants.
     *
     * @async
     * @function getCardsById
     * @param {Array<number>} listCardsId - Liste des identifiants des cartes à récupérer.
     * @returns {Promise<Array<Object>>} - Une promesse qui résout en un tableau contenant les informations des cartes.
     * @throws {Error} - Lance une erreur si un ou plusieurs appels échouent.
     *
     * @example
     * const cards = await getCardsById([1, 2, 3]);
     * console.log(cards);
     * // Résultat attendu : [{ id: 1, name: "Card 1" }, { id: 2, name: "Card 2" }, ...]
     */
    async getCardsById(listCardsId){
        try {
            const promises = listCardsId.map(async (cardId) => {
                try {
                    const data = await cardRepository.getCardById(cardId);
                    console.log(`data pour cardId: ${cardId} : `+JSON.stringify(data));

                    return  data;
                } catch (error) {
                    console.error("Error fetching cards:", error);
                    throw error;
                }
            });


            const results = await Promise.all(promises);
            console.log("results :"+results);
            return results;
        } catch (error) {
            console.error("Error fetching cards:", error);
            throw error; // Gérez l'erreur comme vous le souhaitez
        }
    }

}