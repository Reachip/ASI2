import axios from "axios";

export class UserRepository {
    constructor() {
        this.url = 'http://localhost:8080/api/user/';
    }

    async getUserCards(id) {
        const response = await axios.get(`${this.url}${id}/cards`);
        return response.data.cardList;
    }

}
