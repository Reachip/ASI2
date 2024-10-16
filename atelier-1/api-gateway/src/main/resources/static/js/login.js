import { showAlert, Alert } from './alerts.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#form-login");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.querySelector("#form-login-username").value;
        const password = document.querySelector("#form-login-password").value;
        
        fetch("http://localhost:8080/user/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {            
                response.json().then(data => {
                    localStorage.setItem("scoobycards-user-token", data.token);
                    window.location.replace("./cards.html");
                }).catch(error => {
                    console.error("Error when parsing JSON:", error);
                    localStorage.removeItem("scoobycards-user-token");
                    showAlert(Alert.ERROR, "Une erreur est survenue.");
                });
            } else {
                showAlert(Alert.ERROR, "Échec de la connexion. L'identifiant ou le mot de passe sont invalides.");

                localStorage.removeItem("scoobycards-user-token");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            showAlert(Alert.ERROR, "Une erreur est survenue.");
        });
    });
});