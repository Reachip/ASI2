import { showAlert, Alert } from './alerts.js';

const userToken = localStorage.getItem("scoobycards-user-token");

document.addEventListener("DOMContentLoaded", function () {
    fetch(`http://localhost:8080/rooms`, {
        method: "GET"
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    const template = document.querySelector("#row");
                    const roomContainer = document.querySelector("#table-rooms-body");
                    roomContainer.querySelectorAll('.room-row').forEach(row => {
                        row.remove();
                    });

                    for (const room of data) {
                        const clone = document.importNode(template.content, true);
                        
                        const newContent = clone.firstElementChild.innerHTML
                            .replace(/{{id}}/g, room.id)
                            .replace(/{{room}}/g, room.name)
                            .replace(/{{player}}/g, room.owner.username)
                            .replace(/{{bet}}/g, room.bet)
                        clone.firstElementChild.innerHTML = newContent;

                        roomContainer.appendChild(clone);

                        /* Handle room preview */
                        const rows = document.querySelectorAll('.room-row');
                        const preview = document.querySelector('#room-preview');
                        const previewImage = document.querySelector('#preview-image');
                        const previewRoom = document.querySelector('#preview-room');
                        const previewName = document.querySelector('#preview-name');
                        const previewBet = document.querySelector('#preview-bet');
                        const playButton = document.querySelector('.button-play');

                        rows.forEach(row => {
                            row.querySelector(".button-details").addEventListener("click", () => {
                                previewImage.src = `https://api.dicebear.com/8.x/thumbs/svg?seed=${row.children[2].textContent}`;
                                previewRoom.textContent = row.children[1].textContent;
                                previewName.textContent = row.children[2].textContent;
                                previewBet.textContent = row.children[3].textContent;
                                playButton.href = `room.html?id=${row.children[0].textContent}`;

                                preview.classList.remove('hidden');
                            });
                        });
                    }
                }).catch(error => {
                    console.error("Error when parsing JSON:", error);
                });
            } else {
                showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des parties.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            showAlert(Alert.ERROR, "Une erreur est survenue. Impossible de charger la liste des parties.");
        });
});