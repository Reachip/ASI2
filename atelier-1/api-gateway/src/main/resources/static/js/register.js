import { showAlert, Alert } from './alerts.js';

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#form-register");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const surname = document.querySelector("#form-register-surname").value;
        const name = document.querySelector("#form-register-name").value;
        const email = document.querySelector("#form-register-email").value;
        const username = document.querySelector("#form-register-username").value;
        const password = document.querySelector("#form-register-password").value;
        const passwordConfirmation = document.querySelector("#form-register-password-confirmation").value;

        if(password != passwordConfirmation) {
            return showAlert(Alert.ERROR, "Les mots de passe sont différents.");
        }

        fetch("http://localhost:8080/register", {
            method: "POST",
            body: JSON.stringify({
                surname: surname,
                name: name,
                email: email,
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {
                showAlert(Alert.SUCCESS, "Connexion réussie.");
            
                response.json().then(data => {
                    localStorage.setItem("scoobycards-user-token", data.token);
                    window.location.replace("./cardList.html");
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