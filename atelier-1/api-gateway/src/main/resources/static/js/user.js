import { showAlert, Alert } from './alerts.js';

document.addEventListener("DOMContentLoaded", function () {
    const userDataForm = document.querySelector("#form-user-data");
    const userToken = localStorage.getItem("scoobycards-user-token");

    userDataForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const surname = document.querySelector("#form-user-surname").value;
        const name = document.querySelector("#form-user-name").value;
        const email = document.querySelector("#form-user-email").value;
        const username = document.querySelector("#form-user-username").value;

        fetch("http://localhost:8080/user/edit", {
            method: "PUT",
            body: JSON.stringify({
                surname: surname,
                name: name,
                email: email,
                username: username
            }),
            headers: {
                "Authorization": "Bearer " + userToken,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => {
                if (response.ok) {
                    showAlert(Alert.SUCCESS, "Modification des informations effectuée.");
                    const usernameBadge = document.querySelector("#badge-username");
                    const userIdentityStr = `${surname} ${name}`;
                    usernameBadge.innerHTML = `<i class="fa-solid fa-user"></i> ${userIdentityStr}`;

                    const identities = document.querySelectorAll(".identity");
                    identities.forEach(identity => {
                        identity.innerHTML = userIdentityStr;
                    });
                } else {
                    showAlert(Alert.ERROR, "Une erreur est survenue.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showAlert(Alert.ERROR, "Une erreur est survenue.");
            });
    });

    const userPasswordForm = document.querySelector("#form-user-password");

    userPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const oldPassword = document.querySelector("#form-user-password-old").value;
        const newPassword = document.querySelector("#form-user-password-new").value;
        const newPasswordConfirmation = document.querySelector("#form-user-password-new-confirmation").value;

        if (newPassword != newPasswordConfirmation) {
            return showAlert(Alert.ERROR, "Les mots de passe sont différents.");
        }

        fetch("http://localhost:8080/user/edit/password", {
            method: "PUT",
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            }),
            headers: {
                "Authorization": "Bearer " + userToken,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => {
                if (response.ok) {
                    showAlert(Alert.SUCCESS, "Modification du mot de passe effectuée.");
                    const passwordInputs = document.querySelectorAll("input[type='password']");
                    passwordInputs.forEach(passwordInput => {
                        passwordInput.value = '';
                    });
                } else {
                    showAlert(Alert.ERROR, "L'ancien mot de passe est incrorrect.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showAlert(Alert.ERROR, "Une erreur est survenue.");
            });
    });
});