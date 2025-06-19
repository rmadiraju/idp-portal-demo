import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Paper, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface HelpChatProps {
  onClose?: () => void;
}

interface ChatMessage {
  sender: 'agent' | 'user';
  text: string;
}

const initialMessages: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Hi I am DevAgent! How can I help you?',
  },
];

const HelpChat: React.FC<HelpChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setInput('');
    // Optionally, you can add a fake agent reply here for demo
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)', // minus app bar
      maxWidth: 500,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 2,
      boxShadow: 3,
      mt: 4,
      position: 'relative',
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee', position: 'relative' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
          <SmartToyIcon />
        </Avatar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          DevAgent
        </Typography>
        {onClose && (
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      {/* Chat Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, background: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1.5,
            }}
          >
            {msg.sender === 'agent' && (
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 28, height: 28 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                px: 2,
                py: 1,
                maxWidth: '70%',
                background: msg.sender === 'agent' ? '#e3f2fd' : '#1976d2',
                color: msg.sender === 'agent' ? 'inherit' : '#fff',
                borderRadius: msg.sender === 'agent' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
            {msg.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, width: 28, height: 28 }}>
                U
              </Avatar>
            )}
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>
      {/* Input Area */}
      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', p: 2, borderTop: '1px solid #eee', background: '#fff' }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
          autoFocus
        />
        <Button type="submit" variant="contained" disabled={!input.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default HelpChat; 