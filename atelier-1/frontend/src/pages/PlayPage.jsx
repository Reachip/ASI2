import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import ChatPanel from '../components/chat/ChatPanel';
import GameBoard from '../components/play/GameBoard';
import PopupDialog from '../components/layout/PopupDialog';
import CardsGrid from '../components/cards/CardsGrid';
import SearchingOpponent from '../components/play/SearchingOpponent';

const PlayPage = ({ chatMessages, connectedUsers, onSendMessage, nodeSocket }) => {
    const { user } = useSelector(selectAuth);
    const [gameStarted, setGameStarted] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(null);
    const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const currentPlayer = { id: user.id, username: user.username, actionPoints: 3, isCurrentPlayer: true };

    const fetchPlayerCards = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8088/user/${user.id}/cards`);
            setPlayerCards(response.data.cardList);
        } catch (err) {
            console.error(err);
        }
    }, [user.id]);

    useEffect(() => {
        fetchPlayerCards();
    }, [fetchPlayerCards]);

    // Données de test :
    const opponentCards = useMemo(() => [
        { "id": 68, "name": "Griffin", "img_src": "https://t3.ftcdn.net/jpg/05/84/03/80/360_F_584038065_bTAe8Ly8ZBejUYsJZVJFgYVYGCwbXRtN.jpg", "description": "A magical winged lion", "hp": 21, "energy": 25, "defense": 8, "attack": 15 },
        { "id": 69, "name": "Lich", "img_src": "https://t4.ftcdn.net/jpg/05/83/64/15/360_F_583641514_Lq6e2rbkErV2DUUSG8bX6jBTZaLVSd3s.jpg", "description": "A powerful undead sorcerer", "hp": 23, "energy": 30, "defense": 10, "attack": 22 },
        { "id": 70, "name": "Dwarf", "img_src": "https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vOGNkZTM2NzktMzhmMi00MjhjLWIyYWMtNmEwYjhhOTM3OTljLmpwZWc.webp", "description": "A stout and hardy warrior", "hp": 24, "energy": 20, "defense": 11, "attack": 16 },
        { "id": 71, "name": "Kitsune", "img_src": "https://neural.love/cdn/thumbnails/1ed4c99a-a6f9-6dc8-9f44-1f2c3e42b3d5/180f090a-bfe0-5487-9c0b-972d4b186dc9.webp?Expires=1767225599&Signature=b0Wvge1IAhKKntZ1OVd3QjUzt481WsCLlc3EKn~2Q5uiFMBi~N9lTGkgUW9rifcytGJtjcO3XMjOlXEW~yc5fhUL6e~7OvK5JqvHM7uSGvJ-MDgwmqC2wD568rzsq8EH4nsfjqXlYHeSLGvDa4eakUmw-GjiDxrLBtxi7923x8QCidwACb1rYXSIwQjaLr-0AuQqnXOMpLVjbZpRw0FeOkXHuGFarSnj917UuHm6TQS1N~yxigb6gDGDzi2W8Ujsm1Az5Zz7M1KzBeTN0j0gWO3nwXja2~nHsnnMb~Mkd6RB~DHOWQlhZFeAh-uGJ9P7Y3xCvLcHiQL2FOZwfsJLvA__&Key-Pair-Id=K2RFTOXRBNSROX", "description": "A cunning fox spirit", "hp": 20, "energy": 24, "defense": 8, "attack": 14 },
        { "id": 72, "name": "Treant", "img_src": "https://images.nightcafe.studio/jobs/SIIcGFtJ2LjojmN6iOoe/SIIcGFtJ2LjojmN6iOoe--1--q2s6i.jpg?tr=w-1600,c-at_max", "description": "A massive tree guardian", "hp": 35, "energy": 18, "defense": 15, "attack": 18 }
    ], []);

    const opponent = { id: 999999, username: 'Eric Smith', actionPoints: 3, isCurrentPlayer: false };

    const handleOpponentCardSelect = (card) => {
        setSelectedOpponentCard(card);
    };

    const handlePlayerCardSelect = (card) => {
        setSelectedPlayerCard(card);
    };

    const handleStartGame = () => {
        setDialogOpen(true);
    };

    const startGame = useCallback(() => {
        setDialogOpen(false);
        setGameStarted(true);
        setSelectedPlayerCard(selectedCards[0]);
        setSelectedOpponentCard(opponentCards[0]);
    }, [selectedCards, opponentCards]);

    useEffect(() => {
        if (nodeSocket) {
            nodeSocket.on("notifyRoomFightCreated", (msg) => {
                console.log("notifyRoomFightCreated: " + JSON.stringify(msg));
                startGame();
            });
        }
    }, [nodeSocket, startGame]);

    const handleCloseDialog = () => {
        if (!isSearching) {
            setDialogOpen(false);
        }
    };

    const startSearchingForOpponent = () => {
        setIsSearching(true);
        nodeSocket.emit("play", {
            id: currentPlayer.id,
            cards: selectedCards.map((card) => card.id)
        });
    };

    const handleCancelSearch = () => {
        setIsSearching(false);
        nodeSocket.emit("playCancel", { id: currentPlayer.id });
    };

    const filteredUsers = connectedUsers.filter(u => u.username !== user.username);

    const dialogActions = isSearching ? (
        <Button
            onClick={handleCancelSearch}
            color="error"
            variant="contained"
        >
            Annuler la recherche
        </Button>
    ) : (
        <>
            <Button onClick={handleCloseDialog} color="inherit">
                Annuler
            </Button>
            <Button
                onClick={startSearchingForOpponent}
                disabled={selectedCards.length !== 5}
                variant="contained"
                color="primary"
            >
                Lancer le combat
            </Button>
        </>
    );

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', gap: 2, padding: 0 }}>
            <ChatPanel
                currentUser={user}
                messages={chatMessages}
                users={filteredUsers}
                onSendMessage={onSendMessage}
                socket={nodeSocket}
            />

            {!gameStarted ? (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 3,
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h4" component="h1" textAlign="center">
                        Prêt pour le combat ?
                    </Typography>
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                        Choisissez vos meilleures cartes et affrontez votre adversaire dans un duel épique !
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartGame}
                        sx={{ minWidth: 200 }}
                    >
                        Jouer
                    </Button>
                </Box>
            ) : (
                <GameBoard
                    opponent={opponent}
                    currentPlayer={currentPlayer}
                    opponentCards={opponentCards}
                    playerCards={selectedCards}
                    selectedOpponentCard={selectedOpponentCard}
                    selectedPlayerCard={selectedPlayerCard}
                    onOpponentCardSelect={handleOpponentCardSelect}
                    onPlayerCardSelect={handlePlayerCardSelect}
                />
            )}

            <PopupDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                title={isSearching ? "Recherche d'adversaire" : "Sélectionnez vos cartes"}
                actions={dialogActions}
            >
                {isSearching ? (
                    <SearchingOpponent selectedCards={selectedCards} />
                ) : (
                    <CardsGrid
                        cards={playerCards}
                        selectedCards={selectedCards}
                        onCardSelect={setSelectedCards}
                        maxSelectable={5}
                    />
                )}
            </PopupDialog>
        </Box>
    );
};

export default PlayPage;
