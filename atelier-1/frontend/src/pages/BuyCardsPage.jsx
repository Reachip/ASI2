import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {addToWallet, selectAuth} from '../store/authSlice';
import CardsTable from '../components/cards/CardsTable';
import CardPreview from '../components/cards/CardPreview';
import Notification from "../components/layout/Notification";

const BuyCardsPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const { user } = useSelector(selectAuth);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const userId = user.id;
      const response = await fetch(`http://localhost:8088/store/cards_to_buy/${userId}`);
      const data = await response.json();
      setCards(data);

      if (data.length > 0) {
        setSelectedCard(data[0]);
      }
    };

    fetchCards();
  }, [user.id]);

  const buyCard = async (card) => {
    const response = await fetch('http://localhost:8088/store/buy', {
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
      await response.json();
      dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { ...user, wallet: user.wallet - card.price },
      });

      const newCards = cards.filter((c) => c.id !== card.id);
      setCards(newCards);
      setSelectedCard(newCards[0]);

      return true;
    }
    return false;
  }

  const handleBuy = async (card) => {
    if (user.wallet >= card.price) {
      let result = await buyCard(card);
      console.log(result);
      if (result) {
        dispatch(addToWallet(-card.price))
        setCurrentMessage(`You have successfully bought the card ${card.name}.`);
        setOpen(true);
      }
    }
    else {
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
            onAction={handleBuy}
            label={`Buy for ${selectedCard ? selectedCard.price : ''}$`}
            color="primary"
          />
        </Box>
      </Box>
    </div>
  );
};

export default BuyCardsPage;