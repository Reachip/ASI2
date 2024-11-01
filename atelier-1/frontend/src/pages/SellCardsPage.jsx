import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';

const SellCardsPage = () => {
  const { user, login } = useAuth();
  const [selectedCard, setSelectedCard] = useState(null);
  const [userCards] = useState([
    {
      id: 3,
      family_name: "Marvel",
      img_src: "https://static.hitek.fr/img/actualite/2017/06/27/i_deadpool-2.jpg",
      name: "DEADPOOL",
      description: "Le convoi d'Ajax est attaqué par Deadpool...",
      hp: 999,
      energy: 100,
      attack: 15,
      defense: 15,
      price: 250
    }
  ]);

  useEffect(() => {
    if (userCards.length > 0) {
      setSelectedCard(userCards[0]);
    }
  }, [userCards]);

  const handleSell = (card) => {
    login({
      ...user,
      wallet: user.wallet + card.price,
    });
  };

  return (
    <div className="relative min-h-screen">
      <Typography variant="h4" gutterBottom>
        Sell Cards
      </Typography>
      <Box display="flex">
        <Box flex={1} pr={2}>
          <CardsTable
            cards={userCards}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            action="sell"
          />
        </Box>
        <Box width="360px" pl={2}>
          <CardPreview 
            card={selectedCard} 
            onAction={handleSell}
            actionLabel="Sell for"
            actionColor="error"
          />
        </Box>
      </Box>
    </div>
  );
};

export default SellCardsPage;
