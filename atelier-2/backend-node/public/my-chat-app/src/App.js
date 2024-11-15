import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatApp = () => {
// État pour gérer les informations de l'utilisateur
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

// Liste d'utilisateurs connecté
  const [selectedUser, setSelectedUser] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);

// État pour gérer la connexion WebSocket, les messages, et l'entrée utilisateur
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("updateConnectedUsers", (users) => {
        // Filtrer l'utilisateur actuel en comparant les `userId`
        const filteredUsers = users.filter(user => user.userId !== userId);
        console.log("Données reçues (filtrées) :", filteredUsers);
        console.log("selectedUser :", selectedUser);
        // Mettre à jour la liste sans inclure l'utilisateur actuel
        if (filteredUsers.length > 0) {
          setConnectedUsers(filteredUsers);
        } else {
          setConnectedUsers([]);  // Aucune autre connexion active
        }
        console.log("id trouvé ?  :", filteredUsers.find(user => user.userId === selectedUser));
        // Si on ne retrouve pas l'utilisateur avec qui on communiquait
        if (!filteredUsers.find(user => user.userId === selectedUser)) setSelectedUser("all");

      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("selectedUser a été mis à jour :", selectedUser);
  }, [selectedUser]);

  // Gestion de la réception des nouveaux messages
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("notifyConversationHistory", (msg) => {
        console.log("Reception historique de la conversation : "+ JSON.stringify(msg));
        setMessages(msg);
      });
    }
  }, [socket]);

  // Connexion au serveur WebSocket
  const handleConnect = () => {
    if (userId && username) {
      const newSocket = io.connect("http://localhost:3002", {
        query: {
          userId: userId,
          username: username
        }
      });

      newSocket.on("connect", () => {
        console.log("Connecté avec succès au serveur, ID du socket :", newSocket.id); // socket.id est accessible ici
      });

      setSocket(newSocket);
      console.log("Socket :"+ socket);
    }
  };

  const updateSelectedUser = async (newValue) => {
    console.log("updateSelectedUser :");
    console.log("Value selection :"+newValue);
    console.log("Liste des utilisateurs connecté  :"+connectedUsers);
    console.log("Value Ancienne selection  :"+selectedUser);

    console.log("Ancient utilisateur selectionné :"+ (selectedUser==="all" ? "all" : connectedUsers.find(user => user.userId === selectedUser).username) );
    console.log("Nouveau utilisateur selectionné :"+ (newValue==="all" ? "all" : connectedUsers.find(user => user.userId === newValue).username));

    // Dans le cas ou la precedente selection est all
    let oldSelectedUser = null;
    if (selectedUser !== "all") oldSelectedUser = connectedUsers.find(user => user.userId === selectedUser);

    // Dans le cas ou la nouvelle selection est all
    let newSelectedUser = null;
    if (newValue !== "all") newSelectedUser = connectedUsers.find(user => user.userId === newValue);

    await setSelectedUser(newValue);

    // Mise à jour de l'utilisateur selectionné
    socket.emit("updateSelectedUser", {
      oldSelectedUserId: oldSelectedUser ? oldSelectedUser.userId : "all",
      newSelectedUserId: newSelectedUser ? newSelectedUser.userId : "all",
      userId: userId,
      newSelectedUserSocketId: newSelectedUser ? newSelectedUser.socketId : null
    });
  }


// Fonction pour gérer l'envoi de message
  const handleSendMessage = () => {
    if (message && socket) {
      console.log("selectedUser : "+selectedUser);
      const newMessage = {
        from: { id: userId, username: username }, // Contient les deux informations nécessaires
        to: selectedUser!=="all" ? { id: selectedUser, username: connectedUsers.find(user => user.userId === selectedUser).username } : "all" ,
        content: message,
        time: new Date().toLocaleTimeString()
      };

      console.log(`${username} envoie d'un message a ${selectedUser} : ${message}`);
      console.log("newMessage: "+newMessage);
      // Envoi du message au serveur
      socket.emit("sendMessage", newMessage);

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
          <button onClick={handleConnect}>Se connecter</button>
        </div>

        {/* Liste déroulante pour sélectionner l'utilisateur destinataire */}
        <div style={{ marginTop: "1rem" }}>
          <label>Sélectionner un utilisateur :</label>
          <select onChange={(e) => updateSelectedUser(e.target.value)}>
            {/*<option value="">Choisir un utilisateur</option>*/}
            <option value="all">Tous</option>
            {connectedUsers.map((user) => (
                <option key={user.userId } value={user.userId }>
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
                [{msg.time}] <strong>{msg.from}</strong> : {msg.content}
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