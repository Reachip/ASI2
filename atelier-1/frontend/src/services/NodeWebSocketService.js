import { io } from "socket.io-client";
import { webSocketListenerService } from './WebSocketListenerService';

class NodeWebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = {};
    }

    initialize(user) {
        if (!user) return;

        const socket = io("http://localhost:3002", {
            query: {
                id: user.id,
                username: user.username
            }
        });

        socket.on("connect", () => {
            console.log("Node Socket.IO connection established");
            this.socket = socket;
            webSocketListenerService.notifyListeners('nodeConnect', socket);
        });

        socket.on("updateConnectedUsers", (users) => {
            const filteredUsers = users.filter(u => u.userId !== user.id);
            console.log('Node Socket.IO updateConnectedUsers received:', filteredUsers);
            webSocketListenerService.notifyListeners('updateConnectedUsers', filteredUsers);
        });

        socket.on("newMessage", (message) => {
            console.log('Node Socket.IO newMessage received:', message);
            webSocketListenerService.notifyListeners('newMessage', message);
        });

        socket.on("notifyConversationHistory", (history) => {
            console.log('Node Socket.IO notifyConversationHistory received:', history);
            webSocketListenerService.notifyListeners('conversationHistory', history);
        });

        socket.on("disconnect", () => {
            console.log("Node Socket.IO connection closed");
            this.socket = null;
            webSocketListenerService.notifyListeners('nodeDisconnect');
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }

    sendChatMessage(message, user) {
        if (!this.socket || !user) return;

        this.socket.emit("sendMessage", {
            from: { id: user.id, username: user.username },
            to: message.recipient,
            content: message.text,
            time: new Date()
        });
    }
}

export const nodeWebSocketService = new NodeWebSocketService();