import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';

const BuyCardsPage = () => {
  const { user, login } = useAuth();
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards] = useState([
    {
      id: 1,
      family_name: "DC Comic",
      img_src: "http://www.superherobroadband.com/app/themes/superhero/assets/img/superhero.gif",
      name: "SUPERMAN",
      description: "The origin story of Superman relates that he was born Kal-El on the planet Krypton...",
      hp: 500,
      energy: 100,
      attack: 50,
      defense: 50,
      price: 200
    },
    {
      id: 2,
      family_name: "DC Comic",
      img_src: "https://static.fnac-static.com/multimedia/Images/8F/8F/7D/66/6716815-1505-1540-1/tsp20171122191008/Lego-lgtob12b-lego-batman-movie-lampe-torche-batman.jpg",
      name: "BATMAN",
      description: "Bruce Wayne, alias Batman, est un héros de fiction...",
      hp: 50,
      energy: 80,
      attack: 170,
      defense: 80,
      price: 100
    },
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
    if (cards.length > 0) {
      setSelectedCard(cards[0]);
    }
  }, [cards]);

  const handleBuy = (card) => {
    if (user.wallet >= card.price) {
      login({
        ...user,
        wallet: user.wallet - card.price,
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <Typography variant="h4" gutterBottom>
        Buy Cards
      </Typography>
      <Box display="flex">
        <Box flex={1} pr={2}>
          <CardsTable
            cards={cards}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
          />
        </Box>
        <Box width="360px" pl={2}>
          <CardPreview 
            card={selectedCard} 
            onAction={handleBuy}
            actionLabel="Buy for"
            actionColor="primary"
          />
        </Box>
      </Box>
    </div>
  );
};

export default BuyCardsPage;
