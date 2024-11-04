class Repository {
    constructor() {
        this.API = "http://localhost:8080/api";
    }

    async post(endpoint, data) {
        const response = await fetch(`${this.API}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async get(endpoint) {
        const response = await fetch(`${this.API}/${endpoint}`);
        return response.json();
    }

    async put(endpoint, data) {
        const response = await fetch(`${this.API}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async patch(endpoint, data) {
        const response = await fetch(`${this.API}/${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

export default Repository;
