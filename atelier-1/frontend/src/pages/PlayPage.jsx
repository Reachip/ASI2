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

    const currentPlayer = { id: user.id, username: user.username, actionPoints: user.actionPoints, isCurrentPlayer: true };

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
        if (gameNotification.isVisible && gameNotification.onHide) {
            gameNotification.onHide();
        }
    }, [gameNotification]);

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
                    duration: 3000,
                });

                setGameNotification(prev => ({
                    ...prev,
                    onHide: () => {
                        setTimeout(() => {
                            setGameInfo(prevGameInfo => {
                                const updatedGameInfo = { ...prevGameInfo };

                                let card;
                                let playerToUpdate;

                                if (updatedGameInfo.user1.cards.some(c => c.id === cardToAttack.id)) {
                                    card = updatedGameInfo.user1.cards.find(c => c.id === cardToAttack.id);
                                    playerToUpdate = 'user1';
                                } else if (updatedGameInfo.user2.cards.some(c => c.id === cardToAttack.id)) {
                                    card = updatedGameInfo.user2.cards.find(c => c.id === cardToAttack.id);
                                    playerToUpdate = 'user2';
                                }

                                if (card) {
                                    card.hp = finalHp;
                                }

                                if (playerToUpdate === 'user1') {
                                    updatedGameInfo.user1.cards = updatedGameInfo.user1.cards.map(c =>
                                        c.id === cardToAttack.id ? card : c
                                    );
                                } else if (playerToUpdate === 'user2') {
                                    updatedGameInfo.user2.cards = updatedGameInfo.user2.cards.map(c =>
                                        c.id === cardToAttack.id ? card : c
                                    );
                                }

                                updatedGameInfo.userTurn = msg.userTurn;

                                return updatedGameInfo;
                            });
                        }, 3000);
                    }
                }));
            });

            nodeSocket.on("endTurnResponse", (msg) => {
                console.log("endTurnResponse: " + JSON.stringify(msg));
                const currentTurn = gameInfo?.userTurn;

                setGameNotification({
                    type: 'endTurn',
                    isVisible: true,
                    data: {
                        playerName: currentTurn === user.id ? null : (gameInfo?.user1.userId === user.id ? gameInfo?.user2.username : gameInfo?.user1.username)
                    },
                    duration: 3000,
                });

                setGameNotification(prev => ({
                    ...prev,
                    onHide: () => {
                        setTimeout(() => {
                            setGameInfo(prevGameInfo => {
                                const updatedGameInfo = { ...prevGameInfo };

                                updatedGameInfo.userTurn = currentTurn === gameInfo?.user1.userId ? gameInfo?.user2.userId : gameInfo?.user1.userId;

                                return updatedGameInfo;
                            });
                        }, 3000);
                    }
                }));
            });

            nodeSocket.on("endFight", (msg) => {
                console.log("endFight: " + JSON.stringify(msg));

                setTimeout(() => {
                    // Mettre à jour l'état du jeu pour indiquer la fin du combat
                    setGameInfo((prevGameInfo) => {
                        const updatedGameInfo = { ...prevGameInfo };
                        updatedGameInfo.winner = msg.winner;
                        return updatedGameInfo;
                    });

                    const endDuration = 7000;
                    setGameNotification({
                        type: msg.winner === user.id ? 'winner' : 'loser',
                        isVisible: true,
                        duration: endDuration,
                    });

                    setTimeout(() => {
                        setGameStarted(false);
                    }, endDuration);
                }, 5000);
            });
        }

        return () => {
            if (nodeSocket) {
                nodeSocket.off("notifyRoomFightCreated");
                nodeSocket.off("attackResponse");
                nodeSocket.off("endFight");
            }
        };
    }, [nodeSocket, user.id, gameInfo?.userTurn]);

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
        if (!gameInfo || gameInfo.userTurn !== user.id) return;

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

            setSelectedPlayerCard(null);
            setSelectedOpponentCard(null);

            setGameNotification({
                type: 'turn',
                isVisible: true,
                data: { playerName: currentTurn === user.id ? null : (gameInfo?.user1.userId === user.id ? gameInfo?.user2.username : gameInfo?.user1.username) },
                duration: 3000,
            });
        }
    }, [gameInfo?.userTurn, lastTurn, user.id, gameInfo?.user1, gameInfo?.user2]);

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
                        Ready to fight?
                    </Typography>
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                        Choose your best cards and face your opponent in an epic duel!
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartGame}
                        sx={{ minWidth: 200 }}
                    >
                        Play
                    </Button>
                </Box>
            ) : (
                <GameBoard
                    opponent={gameInfo && (user.id === gameInfo.user1.userId ? gameInfo.user2 : gameInfo.user1)}
                    currentPlayer={gameInfo && (user.id === gameInfo.user1.userId ? gameInfo.user1 : gameInfo.user2)}
                    opponentCards={gameInfo && (user.id === gameInfo.user1.userId ? gameInfo.user2.cards : gameInfo.user1.cards)}
                    playerCards={gameInfo && (user.id === gameInfo.user1.userId ? gameInfo.user1.cards : gameInfo.user2.cards)}
                    selectedPlayerCard={selectedPlayerCard}
                    selectedOpponentCard={selectedOpponentCard}
                    onPlayerCardSelect={handlePlayerCardSelect}
                    onOpponentCardSelect={handleOpponentCardSelect}
                    onAttack={handleAttack}
                    onEndTurn={handleEndTurn}
                    isPlayerTurn={gameInfo && gameInfo.userTurn === user.id}
                    currentPlayerName={gameInfo?.userTurn === user.id ? null : (user.id === gameInfo.user1.userId ? gameInfo.user2.username : gameInfo.user1.username)}
                />
            )}

            <PopupDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                title={isSearching ? "Opponent search" : "Select your cards"}
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