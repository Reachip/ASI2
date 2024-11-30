import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../store/authSlice';

import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';
import Notification from "../components/layout/Notification";

const SellCardsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const [selectedCard, setSelectedCard] = useState(null);
  const [userCards, setUserCards] = useState([]);

  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const loadCards = useCallback(async () => {
    const userCardResponse = await fetch(`http://localhost:8088/user/${user.id}/cards`);
    const data = await userCardResponse.json();
    setUserCards(data.cardList);
  }, [user.id]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const sellCard = async (card) => {
    const response = await fetch('http://localhost:8088/store/sell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        card_id: card.id,
      }),
    });

    if (response.ok) {
      dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { ...user, wallet: user.wallet + card.price },
      });
      return true;
    }
    return false;
  };

  const handleSell = async (card) => {
    let result = await sellCard(card);
    if (result) {
      setSelectedCard(null);
      loadCards();

      setCurrentMessage(`You have successfully sold the card ${card.name}.`);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      <Notification open={open} currentMessage={currentMessage} onClose={handleClose} />
      <Typography variant="h4" gutterBottom>
        Sell Cards
      </Typography>
      <Box display="flex">
        <Box flex={1} pr={2}>
          <CardsTable cards={userCards} selectedCard={selectedCard} onSelectCard={setSelectedCard} action="sell" />
        </Box>
        <Box
          width="360px"
          pl={2}
          sx={{
            height: '420px',
            padding: '3px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <CardPreview
            card={selectedCard}
            onAction={handleSell}
            label={`Sell`}
            color="primary"
          />
        </Box>
      </Box>
    </div>
  );
};

export default SellCardsPage;
