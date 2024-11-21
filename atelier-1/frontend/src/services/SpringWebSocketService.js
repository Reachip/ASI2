import { webSocketListenerService } from './WebSocketListenerService';

class SpringWebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = {};
    }

    initialize(user) {
        if (!user) return;

        const ws = new WebSocket('ws://127.0.0.1:8088/ws');

        ws.addEventListener('open', () => {
            console.log('Spring WebSocket connection established');
            this.socket = ws;
            webSocketListenerService.notifyListeners('springConnect', ws);
        });

        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log('Spring WebSocket message received:', data);
            webSocketListenerService.notifyListeners('springMessage', data);
        });

        ws.addEventListener('close', () => {
            console.log('Spring WebSocket connection closed');
            this.socket = null;
            webSocketListenerService.notifyListeners('springDisconnect');
        });

        ws.addEventListener('error', (error) => {
            console.error('Spring WebSocket error:', error);
            webSocketListenerService.notifyListeners('springError', error);
        });

        return () => {
            if (ws) ws.close();
        };
    }
}

export const springWebSocketService = new SpringWebSocketService();