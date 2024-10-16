import { showAlert, Alert } from './alerts.js';

const interval = 1;
const userToken = localStorage.getItem("scoobycards-user-token");

document.addEventListener("DOMContentLoaded", function () {
    const roomId = new URLSearchParams(window.location.search).get('id');

    if (userToken == null) {
        window.location.href = 'login.html';
        return;
    }

    setInterval(() => {
        fetch(`http://localhost:8080/room/${roomId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + userToken
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        console.log(data);
                    });
                }
            });
    }, interval * 1000);
});