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
    const [errorNode, setErrorNode] = useState(null);

    const handleUserList = useCallback((users) => {
        setConnectedUsers(prev => {
            return [...prev, ...users.map(user => ({ ...user, source: 'spring' }))];
        });
    }, []);

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
    }, [handleUserList]);

    const handleNodeMessage = useCallback((message) => {
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            sender: { id: message.from.id, username: message.from.username },
            message: message.content,
            timestamp: message.time
        }]);
    }, []);

    const handleNodeErrorMesssage = useCallback(error => {
        console.log("Error: ", error)
        setErrorNode(error.message);
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

        const cleanupSpring = springWebSocketService.initialize(user);
        const cleanupNode = nodeWebSocketService.initialize(user);

        const listeners = [
            ['springConnect', setSpringSocket],
            ['springMessage', handleSpringMessage],
            ['nodeConnect', setNodeSocket],
            ['newMessage', handleNodeMessage],
            ['errorResponse', handleNodeErrorMesssage],
            ['updateConnectedUsers', setConnectedUsers],
            ['conversationHistory', handleConversationHistory]
        ];

        listeners.forEach(([event, handler]) => {
            const cleanup = webSocketListenerService.addListener(event, handler);
            cleanupFunctions.push(cleanup);
        });

        return () => {
            cleanupSpring?.();
            cleanupNode?.();
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [
        user,
        handleSpringMessage,
        handleNodeMessage,
        handleConversationHistory,
        handleNodeErrorMesssage
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
        sendChatMessage,
        errorNode
    };
};