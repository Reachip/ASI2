import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Notification from './Notification';

const Layout = ({ children, subtitle }) => {
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8088/ws');

    socket.addEventListener('open', () => {
      console.log('Connexion au websocket établie');
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log('Message reçu:', data);

      setGeneratedCard({
        id: data.id,
        img_src: data.imageURL,
        prompt: data.prompt,
        defense: data.defense,
        energy: data.energy,
        hp: data.hp,
        attack: data.attack,
      });

      setCurrentMessage(`A new card (ID: ${data.id}) has been successfully generated and added to your deck.`);
      setOpen(true);
    });

    socket.addEventListener('close', () => {
      console.log('Connexion au websocket fermée');
    });

    socket.addEventListener('error', (event) => {
      console.error('Erreur WebSocket:', event);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Box>
      <Navbar subtitle={subtitle} />
      <Notification open={open} currentMessage={currentMessage} onClose={handleClose} />
      <Container component="main" sx={{ flexGrow: 1, py: 1 }} maxWidth={false}>
        {React.cloneElement(children, { generatedCard })}
      </Container>
    </Box>
  );
};

export default Layout;