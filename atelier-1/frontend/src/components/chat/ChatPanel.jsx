import React from 'react';
import { Box } from '@mui/material';
import Chat from './Chat';

const ChatPanel = ({ currentUser, messages, onSendMessage, users }) => (
    <Box sx={{ width: '20%', height: '100%' }}>
        <Chat
            currentUser={currentUser}
            messages={messages}
            onSendMessage={onSendMessage}
            users={users}
        />
    </Box>
);

export default ChatPanel;