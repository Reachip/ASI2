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

const Chat = ({ currentUser, messages = [], onSendMessage, users = [], socket }) => {
  const [selectedUser, setSelectedUser] = useState(0); // Initialiser avec 0
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

    const isValidValue = users.some(user => user.id === newValue) || newValue === '0';

    if (isValidValue) {
      const oldSelectedUser = selectedUser !== 0 && users ? users.find(user => user.id === selectedUser) : null;
      const newSelectedUser = newValue !== 0 && users ? users.find(user => user.id === newValue) : null;

      await setSelectedUser(newValue);

      if (socket && socket.emit) {
        socket.emit("updateSelectedUser", {
          oldSelectedId: oldSelectedUser ? oldSelectedUser.id : 0,
          newSelectedId: newSelectedUser ? newSelectedUser.id : 0,
          id: currentUser.id,
          newSelectedUserSocketId: newSelectedUser ? newSelectedUser.socketId : null
        });
      } else {
        console.warn("Socket not initialized");
      }
    } else {
      console.warn("Invalid selected user value:", newValue);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          CHAT
        </Typography>
        <Select
          defaultValue=""
          fullWidth
          value={selectedUser}
          onChange={updateSelectedUser}
          size="small"
        >
          <MenuItem value="0">Global Chat</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
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