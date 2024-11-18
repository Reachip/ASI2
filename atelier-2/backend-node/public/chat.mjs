import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatApp = () => {
// État pour gérer les informations de l'utilisateur
const [userId, setUserId] = useState("");
const [username, setUsername] = useState("");

// Liste d'utilisateurs
const [selectedUser, setSelectedUser] = useState("");
const users = [
{ id: 1, username: "JohnDoe" },
{ id: 2, username: "EricSmith" }
// Ajouter plus d'utilisateurs si nécessaire
];

// État pour gérer la connexion WebSocket, les messages, et l'entrée utilisateur
const [socket, setSocket] = useState(null);
const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");

// Connexion au serveur WebSocket
useEffect(() => {
const newSocket = io("http://localhost:3000");
setSocket(newSocket);

// Réception des messages depuis le serveur
newSocket.on("receiveMessage", (msg) => {
setMessages((prevMessages) => [...prevMessages, msg]);
});

return () => {
newSocket.disconnect();
};
}, []);

// Fonction pour gérer l'envoi de message
const handleSendMessage = () => {
if (message && socket) {
const newMessage = {
from: username,
to: selectedUser,
content: message,
time: new Date().toLocaleTimeString()
};

// Envoi du message au serveur
socket.emit("sendMessage", newMessage);

// Ajoute le message à l'affichage localement
setMessages((prevMessages) => [...prevMessages, newMessage]);
setMessage("");
}
};

return (
<div style={{ padding: "2rem" }}>
{/* Formulaire de sélection de l'utilisateur */}
<div>
    <h2>Connexion de l'utilisateur</h2>
    <input
            type="text"
            placeholder="ID de l'utilisateur"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
    />
    <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
    />
</div>

{/* Liste déroulante pour sélectionner l'utilisateur destinataire */}
<div style={{ marginTop: "1rem" }}>
<label>Sélectionner un utilisateur :</label>
<select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
>
<option value="">Choisir un utilisateur</option>
{users.map((user) => (
<option key={user.id} value={user.username}>
    {user.username}
</option>
))}
</select>
</div>

{/* Zone d'affichage des messages */}
<div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", maxHeight: "300px", overflowY: "scroll" }}>
<h3>Messages</h3>
{messages.map((msg, index) => (
    <div key={index} style={{ marginBottom: "0.5rem" }}>
    <strong>{msg.from}</strong> à <strong>{msg.to || "Tous"}</strong> [{msg.time}]: {msg.content}
    </div>
))}
</div>

{/* Champ d'entrée pour les messages et bouton d'envoi */}
<div style={{ marginTop: "1rem" }}>
<textarea
        rows="2"
        placeholder="Entrez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        />
            <button onClick={handleSendMessage} style={{ marginTop: "0.5rem" }}>
            Envoyer
            </button>
        </div>
</div>
        );
        };

export default ChatApp;