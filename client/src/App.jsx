import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box className="relative min-h-screen overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      <Box className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" className="font-extrabold mb-8 text-center text-white text-shadow">
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
                    className="bg-white text-purple-600 hover:bg-purple-100 font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
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
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    View Profiles
                  </Button>
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="col-span-1 md:col-span-2"
              >
                <Button
                  onClick={() => logout()}
                  variant="text"
                  fullWidth
                  className="text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
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
                className="bg-white text-purple-600 hover:bg-purple-100 font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Log In to Get Started
              </Button>
            </motion.div>
          )}
        </Box>
      </Box>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-600 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </Box>
  );
}

export default App;
