import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatMessage = ({ message, isOwnMessage }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
      mb: 1,
      width: '100%',
    }}
  >
    <Box
      sx={{
        maxWidth: '80%',
        backgroundColor: isOwnMessage ? 'primary.main' : 'grey.300',
        color: isOwnMessage ? 'white' : 'black',
        borderRadius: 2,
        p: 1,
        px: 2,
      }}
    >
      <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
        {isOwnMessage ? "You" : message.sender.username} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
      <Typography variant="body2">{message.message}</Typography>
    </Box>
  </Box>
);

const Chat = ({ currentUser, messages = [], onSendMessage, users = [], socket, userId }) => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage({
        text: messageText,
        recipient: selectedUser,
      });
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const updateSelectedUser = async (event) => {
    if (!event?.target?.value) return;

    const newValue = event.target.value;
    console.log("updateSelectedUser :");
    console.log("Value selection :", newValue);
    console.log("Liste des utilisateurs connecté :", users);
    console.log("Value Ancienne selection :", selectedUser);

    const oldUsername = selectedUser === "all" ? "all" :
      (users && users.length > 0) ?
        users.find(user => user.userId === selectedUser)?.username :
        "Unknown";

    const newUsername = newValue === "all" ? "all" :
      (users && users.length > 0) ?
        users.find(user => user.userId === newValue)?.username :
        "Unknown";

    console.log("Ancien utilisateur selectionné :", oldUsername);
    console.log("Nouvel utilisateur selectionné :", newUsername);

    const oldSelectedUser = selectedUser !== "all" && users ?
      users.find(user => user.userId === selectedUser) : null;

    const newSelectedUser = newValue !== "all" && users ?
      users.find(user => user.userId === newValue) : null;

    await setSelectedUser(newValue);

    if (socket && socket.emit) {
      socket.emit("updateSelectedUser", {
        oldSelectedUserId: oldSelectedUser ? oldSelectedUser.userId : "all",
        newSelectedUserId: newSelectedUser ? newSelectedUser.userId : "all",
        userId: userId,
        newSelectedUserSocketId: newSelectedUser ? newSelectedUser.socketId : null
      });
    } else {
      console.warn("Socket not initialized");
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          CHAT
        </Typography>
        <Select
          fullWidth
          value={selectedUser}
          onChange={updateSelectedUser}
          size="small"
        >
          <MenuItem value="all">Global Chat</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.userId} value={user.userId}>
              {user.username}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isOwnMessage={message.sender.id === currentUser.id}
          />
        ))}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default Chat;