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
    const [gameInfo, setGameInfo] = useState(null);
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

    const opponentCards = useMemo(() => [
        // Données fictives à remplacer par les données de `gameInfo` lorsqu'elles sont disponibles
    ], []);

    const handleStartGame = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        if (!isSearching) {
            setDialogOpen(false);
        }
    };

    const startSearchingForOpponent = () => {
        setIsSearching(true);
        nodeSocket.emit("play", {
            id: currentPlayer.id,
            cards: selectedCards.map((card) => card.id),
        });
    };

    const handleCancelSearch = () => {
        setIsSearching(false);
        nodeSocket.emit("playCancel", { id: currentPlayer.id });
    };

    useEffect(() => {
        if (nodeSocket) {
            nodeSocket.on("notifyRoomFightCreated", (msg) => {
                console.log("notifyRoomFightCreated: " + JSON.stringify(msg));
                setGameInfo(msg); // Stocke les infos du jeu dans l'état
                setGameStarted(true); // Passe à l'écran de jeu
                setDialogOpen(false); // Ferme la popup
                setIsSearching(false); // Arrête la recherche
            });
        }

        return () => {
            if (nodeSocket) {
                nodeSocket.off("notifyRoomFightCreated");
            }
        };
    }, [nodeSocket]);

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
                users={connectedUsers.filter(u => u.username !== user.username)}
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
                    opponent={gameInfo?.player2}
                    currentPlayer={gameInfo?.player1}
                    opponentCards={gameInfo?.player2?.cards || []}
                    playerCards={selectedCards}
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
