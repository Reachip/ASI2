import { Alert, showAlert } from './alerts.js';

document.addEventListener("DOMContentLoaded", function () {
    const userToken = localStorage.getItem("scoobycards-user-token");
    const hasToken = !!userToken;
    if (hasToken) {
        fetch("http://localhost:8080/card/user", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + userToken,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        const template = document.querySelector("#row");

                        fetch("http://localhost:8080/store", {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                            .then(response => {
                                if (response.ok) {
                                    response.json().then(stores => {
                                        for (const card of data) {
                                            const clone = document.importNode(template.content, true);
                                            clone.firstElementChild.setAttribute("data-store-id", card.storeId);

                                            const newContent = clone.firstElementChild.innerHTML
                                                .replace(/{{id}}/g, card.id)
                                                .replace(/{{family}}/g, card.family)
                                                .replace(/{{affinity}}/g, card.affinity)
                                                .replace(/{{imgUrl}}/g, card.imgUrl)
                                                .replace(/{{name}}/g, card.name)
                                                .replace(/{{description}}/g, card.description)
                                                .replace(/{{hp}}/g, card.hp)
                                                .replace(/{{energy}}/g, card.energy)
                                                .replace(/{{attack}}/g, card.attack)
                                                .replace(/{{defense}}/g, card.defense)
                                                .replace(/{{price}}/g, card.price);
                                            clone.firstElementChild.innerHTML = newContent;

                                            let cardContainer = document.querySelector("#table-cards-body");
                                            cardContainer.appendChild(clone);
                                        }

                                        /* Handle card preview */
                                        const preview = document.querySelector('#card-preview');
                                        const previewImage = document.querySelector('#preview-image');
                                        const previewName = document.querySelector('#preview-name');
                                        const previewDescription = document.querySelector('#preview-description');
                                        const previewFamily = document.querySelector('#preview-family');
                                        const previewAffinity = document.querySelector('#preview-affinity');
                                        const previewHp = document.querySelector('#preview-hp');
                                        const previewEnergy = document.querySelector('#preview-energy');
                                        const previewDefense = document.querySelector('#preview-defense');
                                        const previewAttack = document.querySelector('#preview-attack');
                                        const previewButton = document.querySelector('#preview-button');

                                        const buttonsDetail = document.querySelectorAll(".button-details")
                                        buttonsDetail.forEach(buttonDetail => {
                                            buttonDetail.addEventListener("click", (event) => {
                                                const row = event.target.parentElement.parentElement;
                                                previewImage.src = row.querySelector('.row-image').src;
                                                previewName.textContent = row.querySelector('span').textContent;
                                                previewDescription.textContent = row.children[2].textContent;
                                                previewFamily.textContent = row.children[3].textContent;
                                                previewAffinity.textContent = row.children[4].textContent;
                                                previewHp.textContent = row.children[5].textContent;
                                                previewEnergy.textContent = row.children[6].textContent;
                                                previewDefense.textContent = row.children[7].textContent;
                                                previewAttack.textContent = row.children[8].textContent;

                                                const storeId = row.getAttribute("data-store-id");
                                                const cardId = row.children[0].getAttribute("data-id");

                                                var radioInputs = ``;
                                                var sellButton;
                                                if (storeId == 0 || !storeId) {
                                                    sellButton = `<button id="button-sell" class="button button-primary button-sell" data-card="${cardId}">
                                                    <i class="fa-solid fa-cart-arrow-down"></i> Vendre
                                                </button>`;

                                                    let isFirstRadio = true;
                                                    stores.forEach(store => {
                                                        radioInputs += `<input type = "radio" id="store-radio-${store.id}" name = "store" value = "${store.id}" data-card="${cardId}" ${isFirstRadio ? "checked" : ""}><label for="${store.id}}">${store.name}</label><br>`;
                                                        isFirstRadio = false;
                                                    });
                                                }
                                                else {
                                                    sellButton = `<button id="button-sell-cancel" class="button button-primary button-sell-cancel" data-card="${cardId}">
                                                    <i class="fa-solid fa-cart-arrow-down"></i> Annuler la vente
                                                </button>`;
                                                }

                                                previewButton.innerHTML = radioInputs + sellButton;

                                                preview.classList.remove('hidden');
                                            });
                                        });
                                    });
                                }
                            }).catch(error => {
                                console.error("Error when parsing JSON:", error);
                            });
                    });
                } else {
                    showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des cartes.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des cartes.");
            });

        document.addEventListener("click", function (event) {
            if (event.target.id == "button-sell") {
                const closestCheckedRadio = event.target.closest('#preview-button')?.querySelector('input[type="radio"]:checked');

                if (closestCheckedRadio) {
                    fetch("http://localhost:8080/store/sell", {
                        method: "POST",
                        body: JSON.stringify({
                            cardId: event.target.getAttribute("data-card"),
                            storeId: closestCheckedRadio.value
                        }),
                        headers: {
                            "Authorization": "Bearer " + userToken,
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                showAlert(Alert.SUCCESS, "Carte ajoutée à la vente.");
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            } else {
                                showAlert(Alert.ERROR, "Échec de la mise en vente de la carte.");
                            }
                        })
                        .catch(error => {
                            console.error("Fetch error:", error);
                            showAlert(Alert.ERROR, "Une erreur est survenue.");
                        });
                } else {
                    showAlert(Alert.ERROR, "Impossible de récupérer le magasin choisi pour la vente de la carte.");
                    return;
                }
            } else if (event.target.id == "button-sell-cancel") {
                fetch("http://localhost:8080/store/sell/cancel", {
                    method: "POST",
                    body: JSON.stringify({
                        cardId: event.target.getAttribute("data-card")
                    }),
                    headers: {
                        "Authorization": "Bearer " + userToken,
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            showAlert(Alert.SUCCESS, "Carte retirée de la vente.");
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else {
                            showAlert(Alert.ERROR, "Échec du retrait de la vente de la carte.");
                        }
                    })
                    .catch(error => {
                        console.error("Fetch error:", error);
                        showAlert(Alert.ERROR, "Une erreur est survenue.");
                    });
            }
        });
    } else {
        window.location.replace("./login.html");
    }
});