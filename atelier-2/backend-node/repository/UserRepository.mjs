import axios from "axios";

export class UserRepository {
    constructor() {
        this.url = 'http://localhost:8080/api/user/';
    }

    async getUserCards(userId) {
        const response = await axios.get(`${this.url}${userId}/cards`);
        return response.data.cardList;
    }

}