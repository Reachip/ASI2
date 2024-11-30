import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';
import Notification from "../components/layout/Notification";

const BuyCardsPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const { user } = useSelector(selectAuth);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards] = useState([
    {
      id: 1,
      img_src: "http://www.superherobroadband.com/app/themes/superhero/assets/img/superhero.gif",
      name: "SUPERMAN",
      description: "The origin story of Superman...",
      hp: 500,
      energy: 100,
      attack: 50,
      defense: 50,
      price: 200,
    },
    {
      id: 2,
      img_src: "https://static.fnac-static.com/multimedia/Images/8F/8F/7D/66/6716815-1505-1540-1/tsp20171122191008/Lego-lgtob12b-lego-batman-movie-lampe-torche-batman.jpg",
      name: "BATMAN",
      description: "Bruce Wayne, alias Batman...",
      hp: 50,
      energy: 80,
      attack: 170,
      defense: 80,
      price: 100,
    },
    {
      id: 3,
      img_src: "https://static.hitek.fr/img/actualite/2017/06/27/i_deadpool-2.jpg",
      name: "DEADPOOL",
      description: "Le convoi d'Ajax est attaqué...",
      hp: 999,
      energy: 100,
      attack: 15,
      defense: 15,
      price: 250,
    },
  ]);

  useEffect(() => {
    if (cards.length > 0) {
      setSelectedCard(cards[0]);
    }
  }, [cards]);

  const buyCard = async (card) => {
    const response = await fetch(`${process.env.REACT_APP_API_BACKEND_URL}/store/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        card_id: card.id,
      }),
    });

    if (response.ok)
    {
      const data = await response.json();
      dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { ...user, wallet: user.wallet - card.price },
      });
        return true;
    }
    return false;
  }

  const handleBuy = async (card) => {
    if (user.wallet >= card.price)
    {
      let result = await buyCard(card);
      console.log(result);
      if (result)
      {
        setCurrentMessage(`You have successfully bought the card ${card.name}.`);
        setOpen(true);
      }
    }
    else
    {
        setCurrentMessage(`You don't have enough money to buy the card ${card.name}.`);
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
        Buy Cards
      </Typography>
      <Box display="flex">
        <Box flex={1} pr={2}>
          <CardsTable cards={cards} selectedCard={selectedCard} onSelectCard={setSelectedCard} />
        </Box>
        <Box width="360px" pl={2}>
          <CardPreview card={selectedCard} onAction={handleBuy} label={`Buy for ${selectedCard ? selectedCard.price : ''}$`} color="primary" />
        </Box>
      </Box>
    </div>
  );
};

export default BuyCardsPage;