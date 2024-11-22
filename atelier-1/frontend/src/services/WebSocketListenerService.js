class WebSocketListenerService {
    constructor() {
        this.listeners = new Map();
    }

    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        console.log(`Listener added for event: ${event}`);
        return () => this.removeListener(event, callback);
    }

    removeListener(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            console.log(`Listener removed for event: ${event}`);
        }
    }

    notifyListeners(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            console.log(`Notifying listeners for event: ${event}`);
            callbacks.forEach(callback => callback(data));
        }
    }
}

export const webSocketListenerService = new WebSocketListenerService();  