import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import api from '../api';

const ChatWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [receiverId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', { receiverId, content });
      setContent('');
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={message.content}
              secondary={`Sent by User ${message.sender_id}`}
            />
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;