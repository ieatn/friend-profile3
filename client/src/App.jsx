import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography, Button, CircularProgress, TextField, Chip, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from './api/Config';
import { useUser } from './contexts/UserContext';
import ChatBot from './Chatbot'; // We'll create this component

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { currentUserId } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    single: false,
    hiking: false,
    cooking: false,
    reading: false,
    travel: false,
    photography: false,
  });
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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


  const checkNonEmptyProfiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles`);
      const hasNonEmptyProfiles = response.data.some(profile => {
        const profileData = JSON.parse(profile.profile_data);
        return profileData && Object.keys(profileData).length > 0;
      });

      if (hasNonEmptyProfiles) {
        navigate('/profiles');
      } else {
        alert("No profiles with data available.");
      }
    } catch (error) {
      console.error('Error checking profiles:', error);
      alert("Error checking profiles. Please try again.");
    }
  };








  useEffect(() => {
    console.log('currentUserId', currentUserId);
    const fetchProfileData = async () => {
      const params = new URLSearchParams(location.search);
      
      if (currentUserId) {
        console.log('currentUserId', currentUserId);
        try {
          const response = await axios.get(`${API_URL}/profiles/${currentUserId}`);
          const parsedProfileData = JSON.parse(response.data.profile_data);
          if (parsedProfileData && Object.keys(parsedProfileData).length > 0) {
            setProfileData(parsedProfileData);
            if (parsedProfileData.personalInfo) {
              setCity(parsedProfileData.personalInfo.location || '');
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfileData();
  }, [location, currentUserId]);

  const handleSearch = async () => {
    try {
      // Prepare the search parameters
      const searchParams = new URLSearchParams({
        keyword: searchInput + ' ' + Object.keys(filters).filter(key => filters[key]).join(' ')
      });

      const response = await axios.get(`${API_URL}/profiles/search?${searchParams.toString()}`);
      if (response.data && response.data.length > 0) {
        // have to filter out the current user's profile from the search results, in string format
        const matchingResult = response.data.find(result => String(result.unique_id) === String(currentUserId));
        console.log('Matching result:', matchingResult);
        const filteredResults = response.data.filter(result => String(result.unique_id) !== String(currentUserId));
        console.log('filteredResults', filteredResults);
        console.log('Result IDs:', filteredResults.map(result => String(result.unique_id)));
        const resultsWithDistance = await Promise.all(filteredResults.map(async (result) => {
          const profileData = result.profile_data;
          const distance = await calculateDistance(String(city), String(profileData.personalInfo.location));
          return { ...result, distance: String(distance) };
        }));
        setSearchResults(resultsWithDistance);
        console.log(resultsWithDistance);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResults([]);
    }
  };

  const calculateDistance = async (fromCity, toLocation) => {
    try {
      const response = await axios.get(`/api/distance?origins=${fromCity}&destinations=${toLocation}`);
      if (response.data && response.data.rows && response.data.rows[0].elements) {
        return response.data.rows[0].elements[0].distance.text;
      } else {
        console.error('Unexpected response format:', response.data);
        return 'Distance unavailable';
      }
    } catch (error) {
      console.error('Error calculating distance:', error.response ? error.response.data : error.message);
      return 'Distance unavailable';
    }
  };

  // for params to work, must use the right term, ill call it newId
  // actually this doesnt even fucking work, maybe its stuck at id because of the route in index.js
  const handleViewProfile = (newId) => {
    console.log('id', newId);
    navigate(`/profile/${newId}`);
  };

  const handleFilterToggle = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-screen bg-gray-100">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(200, 200, 255, 0.2), transparent 80%)`
        }}
      />
      <Box className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          {profileData && (
            <Box className="flex items-center mb-6">
              {(profileData.personalInfo.name === 'John Doe' || profileData.personalInfo.name === 'Jane Smith') ? (
                <Avatar
                  src={profileData.personalInfo.gender === 'Female'
                    ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches`
                    : `https://api.dicebear.com/6.x/micah/svg?seed=${profileData.personalInfo.name}`
                  }
                  alt={profileData.personalInfo.name}
                  sx={{ width: 80, height: 80, marginRight: 3 }}
                />
              ) : (
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    marginRight: 3, 
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {profileData.personalInfo.name.charAt(0)}
                </Avatar>
              )}
              <Typography variant="h3" className="font-bold text-gray-800">
                Hello, {profileData.personalInfo.name}!
              </Typography>
            </Box>
          )}
          <Typography variant="h1" className="font-bold text-center text-gray-800 text-4xl md:text-5xl lg:text-6xl">
            Friend Profile Creator
          </Typography>
        </motion.div>
        
        <Box className="w-full max-w-4xl">
          {isAuthenticated ? (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/form" className="w-full">
                    <Button 
                      variant="contained" 
                      fullWidth
                      className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
                    >
                      Create Profile
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
                    onClick={() => {
                      if (!profileData || Object.keys(profileData).length === 0) {
                        alert("No profiles available.");
                      } else {
                        navigate(`/profile/${currentUserId}`);
                      }
                    }}
                  >
                    View My Profile
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  className="bg-green-600 text-white hover:bg-green-700 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
                  onClick={checkNonEmptyProfiles}
                >
                  View All Profiles
                </Button>
                </motion.div>
              </Box>

              <Box className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search profiles (include hobbies and interests)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="mb-4"
                />
                
                <Box className="flex flex-wrap gap-2 mt-4 mb-4">
                  {['single', 'hiking', 'cooking', 'reading', 'travel', 'photography'].map((filter) => (
                    <Chip
                      key={filter}
                      label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                      onClick={() => handleFilterToggle(filter)}
                      color={filters[filter] ? 'primary' : 'default'}
                      className="transition-all duration-300"
                    />
                  ))}
                </Box>
                
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  fullWidth
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Search
                </Button>
              </Box>

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between bg-white p-4 rounded-lg mb-4 shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <Typography variant="body1" className="text-gray-800">
                          {(() => {
                            const profileData = result.profile_data;
                            const name = profileData?.personalInfo?.name || 'Name not available';
                            const location = profileData?.personalInfo?.location || 'Location not available';
                            return `${name} - ${location} (${result.distance} away)`;
                          })()}
                        </Typography>
                        <Button
                          onClick={() => handleViewProfile(result.unique_id)}
                          variant="contained"
                          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                        >
                          View Profile
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {searchInput && searchResults.length === 0 && (
                <Typography variant="body1" className="text-gray-800 mt-4 text-center">
                  No matching profiles found
                </Typography>
              )}
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={() => loginWithRedirect()}
                variant="contained"
                fullWidth
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out text-xl"
              >
                Log In to Get Started
              </Button>
            </motion.div>
          )}
        </Box>
      </Box>
      
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {isAuthenticated && (
          <Button
            onClick={() => navigate('/')}
            variant="text"
            className="text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Log Out
          </Button>
        )}

        <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-200 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </Box>
  );
}

export default App;
