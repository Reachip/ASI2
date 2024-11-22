import { useState, useEffect, useCallback } from 'react';
import { springWebSocketService } from '../services/SpringWebSocketService';
import { nodeWebSocketService } from '../services/NodeWebSocketService';
import { webSocketListenerService } from '../services/WebSocketListenerService';

export const useWebSocket = (user) => {
    const [springSocket, setSpringSocket] = useState(null);
    const [nodeSocket, setNodeSocket] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [generatedCard, setGeneratedCard] = useState(null);

    const handleSpringMessage = useCallback((data) => {
        switch (data.type) {
            case 'cardGenerated':
                setGeneratedCard({
                    id: data.id,
                    img_src: data.imageURL,
                    prompt: data.prompt,
                    defense: data.defense,
                    energy: data.energy,
                    hp: data.hp,
                    attack: data.attack,
                });
                break;
            case 'userList':
                handleUserList(data.users);
                break;
            default:
                console.log('Unhandled message type:', data);
        }
    }, []);

    const handleNodeMessage = useCallback((message) => {
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            sender: { id: message.from.id, username: message.from.username },
            message: message.content,
            timestamp: message.time
        }]);
    }, []);

    const handleUserList = useCallback((users) => {
        setConnectedUsers(prev => {
            return [...prev, ...users.map(user => ({ ...user, source: 'spring' }))];
        });
    }, []);

    const handleConversationHistory = useCallback((history) => {
        const formattedHistory = history.map(message => ({
            id: Date.now(),
            sender: { id: message.from.id, username: message.from.username },
            message: message.content,
            timestamp: message.time
        }));
        setChatMessages(formattedHistory);
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        let cleanupFunctions = [];

        // Initialize sockets
        const cleanupSpring = springWebSocketService.initialize(user);
        const cleanupNode = nodeWebSocketService.initialize(user);

        // Add listeners
        const listeners = [
            ['springConnect', setSpringSocket],
            ['springMessage', handleSpringMessage],
            ['nodeConnect', setNodeSocket],
            ['newMessage', handleNodeMessage],
            ['updateConnectedUsers', setConnectedUsers],
            ['conversationHistory', handleConversationHistory]
        ];

        // Register all listeners and store their cleanup functions
        listeners.forEach(([event, handler]) => {
            const cleanup = webSocketListenerService.addListener(event, handler);
            cleanupFunctions.push(cleanup);
        });

        // Cleanup function
        return () => {
            cleanupSpring?.();
            cleanupNode?.();
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [
        user,
        handleSpringMessage,
        handleNodeMessage,
        handleConversationHistory
    ]);

    const sendChatMessage = useCallback((message) => {
        nodeWebSocketService.sendChatMessage(message, user);
    }, [user]);

    return {
        springSocket,
        nodeSocket,
        chatMessages,
        connectedUsers,
        generatedCard,
        sendChatMessage
    };
};