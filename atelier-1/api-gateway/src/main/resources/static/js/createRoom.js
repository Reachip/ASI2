import { showAlert, Alert } from './alerts.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#form-login");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.querySelector("#form-room-name").value;
        const bet = document.querySelector("#form-room-bet").value;

        fetch("http://localhost:8080/room", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                bet: bet
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {            
                response.json().then(data => {
                    localStorage.setItem("scoobycards-user-token", data.token);
                    window.location.replace("./room.html");
                }).catch(error => {
                    console.error("Error when parsing JSON:", error);
                    localStorage.removeItem("scoobycards-user-token");
                    showAlert(Alert.ERROR, "Une erreur est survenue.");
                });
            } else {
                showAlert(Alert.ERROR, "Échec de la création de la partie.");

                localStorage.removeItem("scoobycards-user-token");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            showAlert(Alert.ERROR, "Une erreur est survenue.");
        });
    });
});