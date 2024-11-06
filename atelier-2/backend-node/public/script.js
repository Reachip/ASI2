function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRoom(userID) {
    return `user-${userID}`
}


document.getElementById('userIDBtn').addEventListener("click", () =>{
    const userId = document.getElementById('userID').value;
    console.log("IDDestination", document.getElementById('IDDestination'))

    const message = document.getElementById('inputField');

    document.getElementById("sendButton").addEventListener("click", () => {
        console.log("sendMessage", {userIdDestination: document.getElementById('IDDestination').value, message: message.value});
        socket.emit("sendMessage", {userIdDestination: document.getElementById('IDDestination').value, message: message.value})
    })

    const socket = io('http://localhost:3000', {
        query: { userId: userId } // Remplacez 'uniqueUserId' par un identifiant unique pour l'utilisateur
    });

    // Événement de connexion réussie
    socket.on('connect', () => {
        console.log('Connecté au serveur WebSocket');
    });

    socket.on('receiveMessage', (data) => {
        console.log(`Receive : ${data}`);
    });

    // Événement de déconnexion
    socket.on('disconnect', () => {
        console.log('Déconnecté du serveur WebSocket');
    });

    // Événement de réception de message
    socket.on('paired', (data) => {
        console.log('Apparié avec un autre utilisateur :', data);
    });

    // Événement de début de combat
    socket.on('fightStarted', (data) => {
        console.log('Combat commencé :', data);
    });

})
