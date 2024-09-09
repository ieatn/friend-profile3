import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from './api/Config';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mouseMove = e => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles/search?keyword=${searchKeyword}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResult({ message: 'No matching profile found' });
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-screen bg-gray-100">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="relative min-h-screen overflow-hidden bg-gray-100">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(200, 200, 200, 0.15), transparent 80%)`
        }}
      />
      <Box className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" className="font-bold mb-8 text-center text-gray-800">
            Friend Profile Creator
          </Typography>
        </motion.div>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {isAuthenticated ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/form" className="w-full">
                  <Button 
                    variant="contained" 
                    fullWidth
                    className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    Create Profile
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/profile" className="w-full">
                  <Button 
                    variant="outlined" 
                    fullWidth
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    View Profiles
                  </Button>
                </Link>
              </motion.div>
              <div className="col-span-1 md:col-span-2">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search profiles..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="bg-white rounded-md mb-4"
                />
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  fullWidth
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out mb-4"
                >
                  Search
                </Button>
                {searchResult && (
                  <div className="text-center mb-4">
                    <Typography variant="body1" className="text-gray-800 mb-2">
                      {searchResult.id ? `Profile found with ID: ${searchResult.id}` : searchResult.message}
                    </Typography>
                    {searchResult.id && (
                      <Button
                        onClick={() => handleViewProfile(searchResult.id)}
                        variant="contained"
                        className="bg-green-600 text-white hover:bg-green-700 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                      >
                        View Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="col-span-1 md:col-span-2"
              >
                <Button
                  onClick={() => logout()}
                  variant="text"
                  fullWidth
                  className="text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                >
                  Log Out
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="col-span-1 md:col-span-2"
            >
              <Button
                onClick={() => loginWithRedirect()}
                variant="contained"
                fullWidth
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
              >
                Log In to Get Started
              </Button>
            </motion.div>
          )}
        </Box>
      </Box>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-200 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </Box>
  );
}

export default App;
