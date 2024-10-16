import { showAlert, Alert } from './alerts.js';

const userToken = localStorage.getItem("scoobycards-user-token");

document.addEventListener("DOMContentLoaded", function () {
    function loadStore(id) {
        fetch(`http://localhost:8080/store/${id}/cards`, {
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
                        const cardContainer = document.querySelector("#table-cards-body");
                        cardContainer.querySelectorAll('.card-row').forEach(row => {
                            row.remove();
                        });

                        for (const card of data) {
                            const clone = document.importNode(template.content, true);

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

                            cardContainer.appendChild(clone);

                            /* Handle card preview */
                            const rows = document.querySelectorAll('.card-row');
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
                            const previewPrice = document.querySelector('#preview-price');
                            const id = document.querySelector('#image-id');

                            rows.forEach(row => {
                                row.querySelector(".button-details").addEventListener("click", () => {
                                    previewImage.src = row.querySelector('.row-image').src;
                                    previewName.textContent = row.querySelector('span').textContent;
                                    previewDescription.textContent = row.children[2].textContent;
                                    previewFamily.textContent = row.children[3].textContent;
                                    previewAffinity.textContent = row.children[4].textContent;
                                    previewHp.textContent = row.children[5].textContent;
                                    previewEnergy.textContent = row.children[6].textContent;
                                    previewDefense.textContent = row.children[7].textContent;
                                    previewAttack.textContent = row.children[8].textContent;
                                    previewPrice.textContent = row.children[9].textContent.replace('$', '');
                                    id.dataset.imageId = row.querySelector('.hidden').dataset.id;

                                    preview.classList.remove('hidden');
                                });
                            });
                        }

                        document.querySelectorAll(".button-buy").forEach(buyButton => {
                            if (userToken == null) {
                                buyButton.classList.add("unclickable")
                                return;
                            }

                            buyButton.addEventListener("click", () => {
                                const cardId = parseInt(buyButton.parentNode.parentNode.querySelector("#image-id").dataset.imageId);
                                console.log(cardId);
                                const storeId = 1;

                                fetch("http://localhost:8080/store/buy", {
                                    method: "POST",
                                    body: JSON.stringify({
                                        cardId,
                                        storeId,
                                    }),
                                    headers: {
                                        "Authorization": "Bearer " + userToken,
                                        "Content-type": "application/json; charset=UTF-8"
                                    }
                                })
                                    .then(_ => {
                                        showAlert(Alert.SUCCESS, "Carte achetée avec succès !")
                                        buyButton.classList.add("unclickable")
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000)
                                    })
                            })
                        })
                    }).catch(error => {
                        console.error("Error when parsing JSON:", error);
                    });
                } else {
                    showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des cartes.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des cartes.");
            });
    }

    fetch("http://localhost:8080/store", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (response.ok) {
                const storeTabs = document.querySelector(".stores-tabs");
                response.json().then(stores => {
                    let isFirstShop = true;
                    stores.forEach(store => {
                        const input = document.createElement("input");
                        input.type = "radio";
                        input.id = `store-${store.id}`;
                        input.classList.add("radio-hidden");
                        input.setAttribute("data-id", store.id);
                        input.name = "stores-tabs";
                        if (isFirstShop) {
                            isFirstShop = false;
                            input.setAttribute("checked", "true");
                        }

                        const label = document.createElement("label");
                        label.setAttribute("for", `store-${store.id}`);
                        label.className = "store-tab";
                        label.textContent = store.name;

                        const span = document.createElement("span");
                        span.className = "items-count";
                        span.textContent = store.cardCount;

                        label.appendChild(span);

                        storeTabs.appendChild(input);
                        storeTabs.appendChild(label);
                    });

                    const glider = document.createElement("span");
                    glider.className = "glider";
                    storeTabs.appendChild(glider);

                    // Handle stores loading
                    const storeRadios = document.querySelectorAll('.stores-tabs input[type="radio"]');

                    storeRadios.forEach(radio => {
                        radio.addEventListener('change', function (event) {
                            if (event.target.checked) {
                                const storeId = event.target.getAttribute('data-id');
                                loadStore(storeId);
                            }
                        });
                    });

                    const defaultSelectedStoreRadio = document.querySelector('.stores-tabs input[type="radio"]:checked');
                    if (defaultSelectedStoreRadio) {
                        const defaultStoreId = defaultSelectedStoreRadio.getAttribute('data-id');
                        loadStore(defaultStoreId);
                    }
                });
            }
        });
});