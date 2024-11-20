import React, { useState, useEffect } from 'react';
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

  async function loadCards() {
    const userCardResponse = await fetch(`http://localhost:8088/api/user/${user.id}/cards`)
    const data = await userCardResponse.json()
    setUserCards(data.cardList)
  }

  useEffect( () => {
    loadCards();
  }, [user]);

  const sellCard = async (card) => {
    const response = await fetch('http://localhost:8088/api/store/sell', {
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
      const data = await response.json();
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
        <Box width="360px" pl={2}>
          <CardPreview card={selectedCard} onAction={handleSell} label={`Sell`} color="primary" />
        </Box>
      </Box>
    </div>
  );
};

export default SellCardsPage;
