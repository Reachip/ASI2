import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '../services/websocket';

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

    const handleNodeMessage = useCallback((msg) => {
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            sender: msg.from,
            message: msg.content,
            timestamp: msg.time,
            source: 'node'
        }]);
    }, []);

    const handleUserList = useCallback((users) => {
        setConnectedUsers(prev => {
            const nodeUsers = prev.filter(user => user.source === 'node');
            return [...nodeUsers, ...users.map(user => ({ ...user, source: 'spring' }))];
        });
    }, []);

    const handleConversationHistory = useCallback((history) => {
        const formattedHistory = history.map(msg => ({
            id: Date.now(),
            sender: msg.from,
            message: msg.content,
            timestamp: msg.time,
            source: 'node'
        }));
        setChatMessages(formattedHistory);
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        let cleanupFunctions = [];

        // Initialize sockets
        const cleanupSpring = websocketService.initializeSpringSockets(user);
        const cleanupNode = websocketService.initializeNodeSockets(user);

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
            const cleanup = websocketService.addListener(event, handler);
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
        websocketService.sendChatMessage(message, user);
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