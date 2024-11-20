import { io } from "socket.io-client";

class WebSocketService {
  constructor() {
    this.springSocket = null;
    this.nodeSocket = null;
    this.listeners = new Map();
  }

  initializeSpringSockets(user) {
    if (!user) return;

    const ws = new WebSocket('ws://127.0.0.1:8088/ws');

    ws.addEventListener('open', () => {
      console.log('Spring WebSocket connection established');
      this.springSocket = ws;
      this._notifyListeners('springConnect', ws);
    });

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this._notifyListeners('springMessage', data);
    });

    ws.addEventListener('close', () => {
      console.log('Spring WebSocket connection closed');
      this.springSocket = null;
      this._notifyListeners('springDisconnect');
    });

    ws.addEventListener('error', (error) => {
      console.error('Spring WebSocket error:', error);
      this._notifyListeners('springError', error);
    });

    return () => {
      if (ws) ws.close();
    };
  }

  initializeNodeSockets(user) {
    if (!user) return;

    const socket = io("http://localhost:3002", {
      query: {
        id: user.id,
        username: user.username
      }
    });

    socket.on("connect", () => {
      console.log("Node Socket.IO connection established");
      this.nodeSocket = socket;
      this._notifyListeners('nodeConnect', socket);
    });

    socket.on("updateConnectedUsers", (users) => {
      const filteredUsers = users.filter(u => u.userId !== user.id);
      this._notifyListeners('updateConnectedUsers', filteredUsers);
    });

    socket.on("newMessage", (msg) => {
      this._notifyListeners('newMessage', msg);
    });

    socket.on("notifyConversationHistory", (history) => {
      this._notifyListeners('conversationHistory', history);
    });

    socket.on("disconnect", () => {
      console.log("Node Socket.IO connection closed");
      this.nodeSocket = null;
      this._notifyListeners('nodeDisconnect');
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.removeListener(event, callback);
  }

  removeListener(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  _notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  sendChatMessage(message, user) {
    if (!this.nodeSocket || !user) return;

    this.nodeSocket.emit("sendMessage", {
      from: { id: user.id, username: user.username },
      to: message.recipient,
      content: message.text,
      time: new Date()
    });
  }
}

export const websocketService = new WebSocketService();