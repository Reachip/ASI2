import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import ChatPanel from '../components/chat/ChatPanel';
import GameBoard from '../components/play/GameBoard';

const sampleMessages = [
    { id: 1, sender: "Eric Smith", message: "Hey, good luck for this game!", timestamp: new Date("2024-01-01T10:00:00").toISOString() },
    { id: 2, sender: "test", message: "Thanks! May the best win 😊", timestamp: new Date("2024-01-01T10:00:30").toISOString() },
    { id: 3, sender: "Eric Smith", message: "Nice card you played there!", timestamp: new Date("2024-01-01T10:01:00").toISOString() }
];

const sampleUsers = [
    { username: "Eric Smith", id: 2 },
    { username: "Kity Poulet", id: 3 },
    { username: "Chuck Norris", id: 4 }
];

const opponentCards = [
    { id: 1, name: 'Dragon', img_src: 'https://r2.starryai.com/results/1018715876/210d992f-6c31-42e6-8256-c760ce1e5526.webp', family_name: 'Mythical', description: 'A fierce dragon', hp: 25, energy: 25, defense: 10, attack: 20 },
    { id: 2, name: 'Phoenix', img_src: 'https://cdn.prod.website-files.com/632ac1a36830f75c7e5b16f0/64f115aafa4db6e7cb5d06ec_d7wb7qw1nmg5iAmD9Cb1W86MZkL6rJm36l09xBNTPKA.webp', family_name: 'Mythical', description: 'A majestic phoenix', hp: 22, energy: 22, defense: 8, attack: 18 },
    { id: 3, name: 'Griffon', img_src: 'https://img.freepik.com/premium-photo/illustration-ofdesign-image-gryphon-sky-with-majes_756405-36588.jpg', family_name: 'Mythical', description: 'A mighty griffon', hp: 23, energy: 23, defense: 9, attack: 19 },
    { id: 4, name: 'Unicorn', img_src: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e487da7a-b13a-469a-b84d-1615aeba211d/dg574e3-939a3270-e20e-45ed-9ea9-3acfd509f426.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2U0ODdkYTdhLWIxM2EtNDY5YS1iODRkLTE2MTVhZWJhMjExZFwvZGc1NzRlMy05MzlhMzI3MC1lMjBlLTQ1ZWQtOWVhOS0zYWNmZDUwOWY0MjYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.2zP-EQodCPj64nHmSlUiS4mELL1kyZFcMnH9qT7j7VQ', family_name: 'Mythical', description: 'A magical unicorn', hp: 20, energy: 20, defense: 12, attack: 15 },
];

const playerCards = [
    { id: 5, name: 'Tiger', img_src: 'https://r2.starryai.com/results/1020473103/592f664b-6e58-49f4-8f3a-560f4725c6a4.webp', family_name: 'Animals', description: 'A powerful tiger', hp: 20, energy: 20, defense: 7, attack: 15 },
    { id: 6, name: 'Snake', img_src: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/681830a2-cd77-42b3-bc24-17b76848eedb/dh3yi1m-a6a9af9b-8adf-441d-9e53-af3349bc2766.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY4MTgzMGEyLWNkNzctNDJiMy1iYzI0LTE3Yjc2ODQ4ZWVkYlwvZGgzeWkxbS1hNmE5YWY5Yi04YWRmLTQ0MWQtOWU1My1hZjMzNDliYzI3NjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.AjWAb0SpkI_I7WN1k-VM-WBJ1urkiI-CEce64Qkzwf0', family_name: 'Animals', description: 'A cunning snake', hp: 18, energy: 18, defense: 6, attack: 14 },
    { id: 7, name: 'Wolf', img_src: 'https://img.freepik.com/premium-photo/african-wolf-about-attacking-images-generative-ai_880278-533.jpg', family_name: 'Animals', description: 'A fierce wolf', hp: 19, energy: 19, defense: 8, attack: 16 },
    { id: 8, name: 'Shark', img_src: 'https://img.freepik.com/premium-photo/shark-attack-clear-ocean-waters_863013-102252.jpg', family_name: 'Animals', description: 'A deadly shark', hp: 21, energy: 21, defense: 9, attack: 17 },
];

const PlayPage = () => {
    const { user } = useSelector(selectAuth);
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(opponentCards[0]);
    const [selectedPlayerCard, setSelectedPlayerCard] = useState(playerCards[0]);

    const opponent = { username: 'Eric Smith', actionPoints: 3, isCurrentPlayer: false };
    const currentPlayer = { username: user.username, actionPoints: 3, isCurrentPlayer: true };

    const handleOpponentCardSelect = (card) => {
        setSelectedOpponentCard(card);
    };

    const handlePlayerCardSelect = (card) => {
        setSelectedPlayerCard(card);
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', gap: 2, padding: 0 }}>
            <ChatPanel
                currentUser={user.username}
                messages={sampleMessages}
                users={sampleUsers}
            />
            <GameBoard
                opponent={opponent}
                currentPlayer={currentPlayer}
                opponentCards={opponentCards}
                playerCards={playerCards}
                selectedOpponentCard={selectedOpponentCard}
                selectedPlayerCard={selectedPlayerCard}
                onOpponentCardSelect={handleOpponentCardSelect}
                onPlayerCardSelect={handlePlayerCardSelect}
            />
        </Box>
    );
};

export default PlayPage;