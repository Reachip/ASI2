import { useState, useEffect } from 'react';
import { websocketService } from '../services/websocket';

export const useWebSocket = (user) => {
    const [springSocket, setSpringSocket] = useState(null);
    const [nodeSocket, setNodeSocket] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [generatedCard, setGeneratedCard] = useState(null);

    useEffect(() => {
        if (!user?.id) return;

        const handleSpringMessage = (data) => {
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
                case 'chat':
                    setChatMessages(prev => [...prev, {
                        id: Date.now(),
                        sender: data.from,
                        message: data.content,
                        timestamp: new Date().toISOString(),
                        source: 'spring'
                    }]);
                    break;
                case 'userList':
                    handleUserList(data.users);
                    break;
                default:
                    console.log('Unhandled message type:', data);
            }
        };

        const handleNodeMessage = (msg) => {
            setChatMessages(prev => [...prev, {
                id: Date.now(),
                sender: msg.from.username,
                message: msg.content,
                timestamp: msg.time,
                source: 'node'
            }]);
        };

        const handleUserList = (users) => {
            setConnectedUsers(prev => {
                const nodeUsers = prev.filter(user => user.source === 'node');
                return [...nodeUsers, ...users.map(user => ({ ...user, source: 'spring' }))];
            });
        };

        const handleConversationHistory = (history) => {
            const formattedHistory = history.map(msg => ({
                id: Date.now(),
                sender: msg.from,
                message: msg.content,
                timestamp: msg.time,
                source: 'node'
            }));
            setChatMessages(formattedHistory);
        };

        websocketService.addListener('springConnect', setSpringSocket);
        websocketService.addListener('springMessage', handleSpringMessage);
        websocketService.addListener('nodeConnect', setNodeSocket);
        websocketService.addListener('newMessage', handleNodeMessage);
        websocketService.addListener('updateConnectedUsers', setConnectedUsers);
        websocketService.addListener('conversationHistory', handleConversationHistory);

        const cleanupSpring = websocketService.initializeSpringSockets(user);
        const cleanupNode = websocketService.initializeNodeSockets(user);

        return () => {
            cleanupSpring?.();
            cleanupNode?.();
        };
    }, [user]);

    const sendChatMessage = (message) => {
        websocketService.sendChatMessage(message, user);
    };

    return {
        springSocket,
        nodeSocket,
        chatMessages,
        connectedUsers,
        generatedCard,
        sendChatMessage
    };
};
