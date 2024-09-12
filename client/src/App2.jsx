import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { API_URL } from './api/Config';
import { motion } from 'framer-motion';
import { UserProvider, useUser } from './contexts/UserContext';

function App2Content() {
  const [profileIds, setProfileIds] = useState([]);
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const { currentUserId, setCurrentUserId } = useUser();

  useEffect(() => {
    if (isAuthenticated && user) {
      const uniqueId = user.sub;
      console.log("Auth0 Unique ID:", uniqueId);
      setCurrentUserId(uniqueId);
      loginToServer(uniqueId);
      fetchProfileIds();
    }
  }, [isAuthenticated, user]);

  const loginToServer = async (uniqueId) => {
    try {
      const loginResponse = await axios.post(`${API_URL}/profiles/login`, { unique_id: uniqueId });
      if (loginResponse.status === 201) {
        console.log("Logged in successfully on server");
        return loginResponse.data.unique_id;
      } else if (loginResponse.status === 409) {
        console.log("Profile already exists, proceeding with existing profile");
        return uniqueId;
      } else {
        console.error("Unexpected response from server:", loginResponse.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error during server authentication:', error);
      return null;
    }
  };

  const fetchProfileIds = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles`);
      const ids = response.data.map(profile => profile.unique_id);
      setProfileIds(ids);
    } catch (error) {
      console.error('Error fetching profile IDs:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUserId) {
      navigate(`/app?id=${currentUserId}`);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        {!isAuthenticated ? (
          <>
            <Typography variant="h4" gutterBottom className="text-center text-gray-800 font-bold">
              Welcome to Friend Profile Creator
            </Typography>
            <Button 
              onClick={() => loginWithRedirect()} 
              variant="contained" 
              fullWidth
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In / Sign Up with Auth0
            </Button>
          </>
        ) : (
          <>
            <Box className="flex items-center justify-center mb-6">
              <Avatar
                src={user.picture}
                alt={user.name}
                sx={{ width: 60, height: 60, marginRight: 2 }}
              />
              <Typography variant="h5" className="text-gray-800 font-bold">
                Welcome, {user.name}!
              </Typography>
            </Box>
            {/* <Typography variant="h6" gutterBottom className="text-center text-gray-700">
              Your User ID: {currentUserId}
            </Typography> */}
            <Button 
              onClick={handleSubmit}
              variant="contained" 
              fullWidth
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue to App
            </Button>
            {/* {profileIds.length > 0 && (
              <Typography variant="body2" className="mt-4 text-gray-600">
                Available Profile IDs: {profileIds.join(', ')}
              </Typography>
            )} */}
          </>
        )}
      </motion.div>
      {isAuthenticated && (
        <Button
          onClick={() => logout({ returnTo: window.location.origin })}
          variant="outlined"
          className="fixed top-4 right-4 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded border-blue-600 z-50"
        >
          Log Out
        </Button>
      )}









      











    </Box>
  );
}

export default function App2() {
  return (
    <App2Content />
  );
}
