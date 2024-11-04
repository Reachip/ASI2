import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../store/authSlice';

import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';

const SellCardsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const [selectedCard, setSelectedCard] = useState(null);
  const [userCards, setUserCards] = useState([]);

  async function loadCards() {
    const userCardResponse = await fetch(`http://localhost:8088/api/user/${user.id}/cards`)
    const data = await userCardResponse.json()
    setUserCards(data.cardList)
  }

  useEffect( () => {
    loadCards();
  }, [user]);

  const handleSell = (card) => {
    dispatch({
      type: 'auth/loginUser/fulfilled',
      payload: { ...user, wallet: user.wallet + card.price },
    });
  };

  return (
    <div className="relative min-h-screen">
      <Typography variant="h4" gutterBottom>
        Sell Cards
      </Typography>
      <Box display="flex">
        <Box flex={1} pr={2}>
          <CardsTable cards={userCards} selectedCard={selectedCard} onSelectCard={setSelectedCard} action="sell" />
        </Box>
        <Box width="360px" pl={2}>
          <CardPreview card={selectedCard} onAction={handleSell} actionLabel="Sell for" actionColor="error" />
        </Box>
      </Box>
    </div>
  );
};

export default SellCardsPage;
