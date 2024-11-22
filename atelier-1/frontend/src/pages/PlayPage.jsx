import React, {useEffect, useState} from 'react';
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
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(null);
    const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const currentPlayer = { username: user.username, actionPoints: 3, isCurrentPlayer: true };

    // Données de test :
    const playerCards = [
        { "id": 1, "name": "Dragon", "img_src": "https://r2.starryai.com/results/1018715876/210d992f-6c31-42e6-8256-c760ce1e5526.webp", "description": "A fierce dragon", "hp": 25, "energy": 25, "defense": 10, "attack": 20 },
        { "id": 2, "name": "Phoenix", "img_src": "https://cdn.prod.website-files.com/632ac1a36830f75c7e5b16f0/64f115aafa4db6e7cb5d06ec_d7wb7qw1nmg5iAmD9Cb1W86MZkL6rJm36l09xBNTPKA.webp", "description": "A majestic phoenix", "hp": 22, "energy": 22, "defense": 8, "attack": 18 },
        { "id": 3, "name": "Hydra", "img_src": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c747b343-db2e-4d0c-80cc-059984f12489/dgoja8e-26af0494-69b4-48f3-8442-367beec3ea44.png/v1/fill/w_894,h_894,q_70,strp/the_hydra___ai_generated_by_umunchkin_dgoja8e-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjA0OCIsInBhdGgiOiJcL2ZcL2M3NDdiMzQzLWRiMmUtNGQwYy04MGNjLTA1OTk4NGYxMjQ4OVwvZGdvamE4ZS0yNmFmMDQ5NC02OWI0LTQ4ZjMtODQ0Mi0zNjdiZWVjM2VhNDQucG5nIiwid2lkdGgiOiI8PTIwNDgifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.wV8PS1GgqkgmuxNag580YdVtfries8NB40CupzJ_g8g", "description": "A multi-headed hydra", "hp": 28, "energy": 28, "defense": 13, "attack": 24 },
        { "id": 4, "name": "Chimera", "img_src": "https://makepix.b-cdn.net/makepix_ce598b74-9088-4096-97e4-a34a582c4f1e/kyaa-chimera-d314ee4a_0_m.webp", "description": "A terrifying chimera", "hp": 27, "energy": 27, "defense": 12, "attack": 23 },
        { "id": 5, "name": "Tiger", "img_src": "https://r2.starryai.com/results/1020473103/592f664b-6e58-49f4-8f3a-560f4725c6a4.webp", "description": "A powerful tiger", "hp": 20, "energy": 20, "defense": 7, "attack": 15 },
        { "id": 6, "name": "Lion", "img_src": "https://img.freepik.com/premium-photo/male-lion-roars-ai-generated_767640-31.jpg", "description": "The king of the jungle", "hp": 24, "energy": 24, "defense": 10, "attack": 20 },
        { "id": 7, "name": "Shark", "img_src": "https://img.freepik.com/premium-photo/shark-attack-clear-ocean-waters_863013-102252.jpg", "description": "A deadly shark", "hp": 21, "energy": 21, "defense": 9, "attack": 17 },
        { "id": 8, "name": "Griffon", "img_src": "https://img.freepik.com/premium-photo/illustration-ofdesign-image-gryphon-sky-with-majes_756405-36588.jpg", "description": "A mighty griffon", "hp": 23, "energy": 23, "defense": 9, "attack": 19 },
        { "id": 9, "name": "Snake", "img_src": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/681830a2-cd77-42b3-bc24-17b76848eedb/dh3yi1m-a6a9af9b-8adf-441d-9e53-af3349bc2766.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY4MTgzMGEyLWNkNzctNDJiMy1iYzI0LTE3Yjc2ODQ4ZWVkYlwvZGgzeWkxbS1hNmE5YWY5Yi04YWRmLTQ0MWQtOWU1My1hZjMzNDliYzI3NjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.AjWAb0SpkI_I7WN1k-VM-WBJ1urkiI-CEce64Qkzwf0", "description": "A cunning snake", "hp": 18, "energy": 18, "defense": 6, "attack": 14 },
        { "id": 10, "name": "Wolf", "img_src": "https://img.freepik.com/premium-photo/african-wolf-about-attacking-images-generative-ai_880278-533.jpg", "description": "A fierce wolf", "hp": 19, "energy": 19, "defense": 8, "attack": 16 }
    ];

    const opponentCards = [
        { "id": 68, "name": "Griffin", "img_src": "https://t3.ftcdn.net/jpg/05/84/03/80/360_F_584038065_bTAe8Ly8ZBejUYsJZVJFgYVYGCwbXRtN.jpg", "description": "A magical winged lion", "hp": 21, "energy": 25, "defense": 8, "attack": 15 },
        { "id": 69, "name": "Lich", "img_src": "https://t4.ftcdn.net/jpg/05/83/64/15/360_F_583641514_Lq6e2rbkErV2DUUSG8bX6jBTZaLVSd3s.jpg", "description": "A powerful undead sorcerer", "hp": 23, "energy": 30, "defense": 10, "attack": 22 },
        { "id": 70, "name": "Dwarf", "img_src": "https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vOGNkZTM2NzktMzhmMi00MjhjLWIyYWMtNmEwYjhhOTM3OTljLmpwZWc.webp", "description": "A stout and hardy warrior", "hp": 24, "energy": 20, "defense": 11, "attack": 16 },
        { "id": 71, "name": "Kitsune", "img_src": "https://neural.love/cdn/thumbnails/1ed4c99a-a6f9-6dc8-9f44-1f2c3e42b3d5/180f090a-bfe0-5487-9c0b-972d4b186dc9.webp?Expires=1767225599&Signature=b0Wvge1IAhKKntZ1OVd3QjUzt481WsCLlc3EKn~2Q5uiFMBi~N9lTGkgUW9rifcytGJtjcO3XMjOlXEW~yc5fhUL6e~7OvK5JqvHM7uSGvJ-MDgwmqC2wD568rzsq8EH4nsfjqXlYHeSLGvDa4eakUmw-GjiDxrLBtxi7923x8QCidwACb1rYXSIwQjaLr-0AuQqnXOMpLVjbZpRw0FeOkXHuGFarSnj917UuHm6TQS1N~yxigb6gDGDzi2W8Ujsm1Az5Zz7M1KzBeTN0j0gWO3nwXja2~nHsnnMb~Mkd6RB~DHOWQlhZFeAh-uGJ9P7Y3xCvLcHiQL2FOZwfsJLvA__&Key-Pair-Id=K2RFTOXRBNSROX", "description": "A cunning fox spirit", "hp": 20, "energy": 24, "defense": 8, "attack": 14 },
        { "id": 72, "name": "Treant", "img_src": "https://images.nightcafe.studio/jobs/SIIcGFtJ2LjojmN6iOoe/SIIcGFtJ2LjojmN6iOoe--1--q2s6i.jpg?tr=w-1600,c-at_max", "description": "A massive tree guardian", "hp": 35, "energy": 18, "defense": 15, "attack": 18 }
    ];

    const opponent = { username: 'Eric Smith', actionPoints: 3, isCurrentPlayer: false };

    const handleOpponentCardSelect = (card) => {
        setSelectedOpponentCard(card);
    };

    const handlePlayerCardSelect = (card) => {
        setSelectedPlayerCard(card);
    };

    const handleStartGame = () => {
        setDialogOpen(true);
    };

    useEffect(() => {
        if (nodeSocket) {
            nodeSocket.on("notifyRoomFightCreated", (msg) => {
                console.log("notifyRoomFightCreated: " + JSON.stringify(msg));
            });
        }
    }, [nodeSocket]);

    const handleCloseDialog = () => {
        if (!isSearching) {
            setDialogOpen(false);
        }
    };

    const handleStartBattle = () => {
        setIsSearching(true);
        nodeSocket.emit("play");

        // TODO: Décommenter cette partie quand la logique de recherche d'adversaire sera implémentée
        // setDialogOpen(false);
        // setGameStarted(true);
        // setSelectedPlayerCard(selectedCards[0]);
        // setSelectedOpponentCard(opponentCards[0]);
    };

    const handleCancelSearch = () => {
        setIsSearching(false);
        nodeSocket.emit("cancelSearch");
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
                onClick={handleStartBattle}
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
                    <SearchingOpponent />
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