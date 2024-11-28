import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import ChatPanel from '../components/chat/ChatPanel';
import GameBoard from '../components/play/GameBoard';
import PopupDialog from '../components/layout/PopupDialog';
import CardsGrid from '../components/cards/CardsGrid';
import SearchingOpponent from '../components/play/SearchingOpponent';
import GameNotification from '../components/play/GameNotification';

const PlayPage = ({ chatMessages, connectedUsers, onSendMessage, nodeSocket }) => {
    const { user } = useSelector(selectAuth);
    const [gameStarted, setGameStarted] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [gameInfo, setGameInfo] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(null);
    const [lastTurn, setLastTurn] = useState(null);
    const [gameNotification, setGameNotification] = useState({ type: null, isVisible: false });

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

            nodeSocket.on("attackResponse", (msg) => {
                console.log("attackResponse: " + JSON.stringify(msg));
                const { cardAttack, cardToAttack, initialHp, finalHp } = msg.attackLabel;

                setGameNotification({
                    type: 'attack',
                    isVisible: true,
                    data: {
                        attackerCard: cardAttack,
                        defenderCard: cardToAttack,
                        initialHp,
                        finalHp,
                    },
                    duration: 5000,
                });

                setGameNotification(prev => ({
                    ...prev,
                    onHide: () => {
                        setGameInfo(prevGameInfo => {
                            const updatedGameInfo = { ...prevGameInfo };
                            const currentPlayerCards = updatedGameInfo.userTurn === user.id ? updatedGameInfo.player1.cards : updatedGameInfo.player2.cards;
                            
                            const card = currentPlayerCards.find(card => card.id === cardToAttack);
                            if (card) card.hp = finalHp;
                        
                            if (updatedGameInfo.userTurn === user.id) {
                                updatedGameInfo.player1.cards = currentPlayerCards;
                            } else {
                                updatedGameInfo.player2.cards = currentPlayerCards;
                            }

                            updatedGameInfo.userTurn = msg.userTurn;

                            return updatedGameInfo;
                        });
                    }
                }));
            });

            nodeSocket.on("endFight", (msg) => {
                console.log("endFight: " + JSON.stringify(msg));
                // Mettre à jour l'état du jeu pour indiquer la fin du combat
                setGameInfo((prevGameInfo) => {
                    const updatedGameInfo = { ...prevGameInfo };
                    updatedGameInfo.winner = msg.winner;
                    return updatedGameInfo;
                });
                setGameStarted(false); // Revenir à l'écran de sélection des cartes

                // Afficher la notification de fin de combat
                setGameNotification({
                    type: msg.winner === user.id ? 'winner' : 'loser',
                    isVisible: true,
                });
            });
        }

        return () => {
            if (nodeSocket) {
                nodeSocket.off("notifyRoomFightCreated");
                nodeSocket.off("attackResponse");
                nodeSocket.off("endFight");
            }
        };
    }, [nodeSocket, user.id]);

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

    const handlePlayerCardSelect = (card) => {
        setSelectedPlayerCard(selectedPlayerCard?.id === card.id ? null : card);
    };

    const handleOpponentCardSelect = (card) => {
        setSelectedOpponentCard(selectedOpponentCard?.id === card.id ? null : card);
    };

    const handleAttack = () => {
        if (!selectedPlayerCard || !selectedOpponentCard || !gameInfo || gameInfo.userTurn !== user.id) return;

        nodeSocket.emit('attack', {
            cardPlayerId: selectedPlayerCard.id,
            cardOpponentId: selectedOpponentCard.id
        });

        setSelectedPlayerCard(null);
        setSelectedOpponentCard(null);
    };

    const handleEndTurn = () => {
        if (!selectedPlayerCard || !selectedOpponentCard || !gameInfo || gameInfo.userTurn !== user.id) return;

        nodeSocket.emit('endTurn', {
            userId: user.id,
        });

        setSelectedPlayerCard(null);
        setSelectedOpponentCard(null);
    };

    useEffect(() => {
        const currentTurn = gameInfo?.userTurn;
        if (currentTurn !== undefined && currentTurn !== lastTurn) {
            setLastTurn(currentTurn);
        }
    }, [gameInfo?.userTurn, lastTurn]);

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
                    opponent={gameInfo && (user.id === gameInfo.player1.id ? gameInfo.player2 : gameInfo.player1)}
                    currentPlayer={gameInfo && (user.id === gameInfo.player1.id ? gameInfo.player1 : gameInfo.player2)}
                    opponentCards={gameInfo && (user.id === gameInfo.player1.id ? gameInfo.player2.cards : gameInfo.player1.cards)}
                    playerCards={gameInfo && (user.id === gameInfo.player1.id ? gameInfo.player1.cards : gameInfo.player2.cards)}
                    selectedPlayerCard={selectedPlayerCard}
                    selectedOpponentCard={selectedOpponentCard}
                    onPlayerCardSelect={handlePlayerCardSelect}
                    onOpponentCardSelect={handleOpponentCardSelect}
                    onAttack={handleAttack}
                    onEndTurn={handleEndTurn}
                    isPlayerTurn={gameInfo && gameInfo.userTurn === user.id}
                    currentPlayerName={gameInfo?.userTurn === user.id ? null : (user.id === gameInfo.player1.id ? gameInfo.player2.username : gameInfo.player1.username)}
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

            <GameNotification
                type={gameNotification.type}
                isVisible={gameNotification.isVisible}
                onHide={() => setGameNotification({ ...gameNotification, isVisible: false })}
                data={gameNotification.data}
            />
        </Box>
    );
};

export default PlayPage;