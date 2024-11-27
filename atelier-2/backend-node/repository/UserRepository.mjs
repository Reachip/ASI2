import axios from "axios";

export class UserRepository {
    constructor() {
        this.url = 'http://localhost:8088/user/';
    }

    async getUserCards(userId) {
        console.log("userId :"+userId);
        const response = await axios.get(`${this.url}${userId}/cards`);

        return response.data.cardList;
    }

}
