import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from './api/Config';

function ChatBot({ isOpen, setIsOpen, name, searchResults, setSearchResults }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async (message = input) => {
    if (message.trim() === '') return;

    const newMessage = { text: `${name}: ${message}`, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: message, name: name });

      if (Array.isArray(response.data)) {
        // Update searchResults with the new data
        setSearchResults(response.data);

        // Create a message to display the search results
        const resultsMessage = {
          text: 'Here are the matching profiles:',
          sender: 'bot',
          isResults: true
        };
        setMessages(prevMessages => [...prevMessages, resultsMessage]);
      } else {
        const botMessage = { text: response.data.response, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, I encountered an error.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col mb-2"
            >
              <Box className="flex-grow overflow-y-auto p-4">
                {/* Clickable text prompt at the top */}
                <div
                  className="mb-2 text-left text-blue-600 cursor-pointer p-2 rounded-lg bg-blue-100"
                  onClick={() => handleSend('single')} // Directly call handleSend with 'single'
                >
                  single
                </div>
                {messages.map((message, index) => (
                  <Typography
                    key={index}
                    className={`mb-2 ${
                      message.sender === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-800'
                    }`}
                  >
                    {message.text}
                    {message.isResults && (
                      <ul className="list-disc pl-5 mt-2">
                        {searchResults.map((result, idx) => (
                          <li key={idx}>
                            {result.profile_data.personalInfo.name} - {result.profile_data.personalInfo.location}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Typography>
                ))}
              </Box>
              <Box className="p-4 border-t">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  variant="contained"
                  fullWidth
                  className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Send
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="contained"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isOpen ? 'Close Chat' : 'Open Chat'}
        </Button>
      </div>
    </motion.div>
  );
}

export default ChatBot;
