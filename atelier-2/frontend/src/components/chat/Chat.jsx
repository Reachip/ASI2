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
                {isOwnMessage ? "You" : message.sender} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="body2">{message.message}</Typography>
        </Box>
    </Box>
);

const Chat = ({ currentUser, users = [], messages = [], onSendMessage }) => {
  const [selectedUser, setSelectedUser] = useState('global');
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

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          CHAT
        </Typography>
        <Select
          fullWidth
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          size="small"
        >
          <MenuItem value="global">Global Chat</MenuItem>
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
            isOwnMessage={message.sender === currentUser}
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