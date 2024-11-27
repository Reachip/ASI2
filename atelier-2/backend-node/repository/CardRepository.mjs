import axios from "axios";

export class CardRepository {
    constructor() {
        this.url = 'http://localhost:8088/card/';
    }

    async getCardById(cardId) {
        console.log("cardId :"+cardId);
        const response = await axios.get(`${this.url}${cardId}`);

        return response.data;
    }

}