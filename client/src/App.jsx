import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography, Button, CircularProgress, TextField, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from './api/Config';
import { useUser } from './contexts/UserContext';

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
        const matchingResult = response.data.find(result => String(result.id) === String(currentUserId));
        console.log('Matching result:', matchingResult);
        const filteredResults = response.data.filter(result => String(result.id) !== String(currentUserId));
        console.log('filteredResults', filteredResults);
        console.log('Result IDs:', filteredResults.map(result => String(result.id)));
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

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
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
          {profileData && (
            <Box className="flex items-center mb-4">
              <Avatar
                src={profileData.personalInfo.gender === 'Female'
                  ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches`
                  : `https://api.dicebear.com/6.x/micah/svg?seed=${profileData.personalInfo.name}`
                }
                alt={profileData.personalInfo.name}
                sx={{ width: 60, height: 60, marginRight: 2 }}
              />
              <Typography variant="h4" className="font-bold text-gray-800">
                Hello, {profileData.personalInfo.name}!
              </Typography>
            </Box>
          )}
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
                <Button 
                  variant="outlined" 
                  fullWidth
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                  onClick={() => {
                    if (!profileData || Object.keys(profileData).length === 0) {
                      alert("No profiles available.");
                    } else {
                      navigate(`/profile/${currentUserId}`);
                      // Navigate to profile view or perform other action
                      // For example: navigate(`/profile/${currentUserId}`);
                    }
                  }}
                >
                  View My Profile
                </Button>
              </motion.div>

              <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white rounded-md mb-4"
                />
              {/* SEARCHBAR AND FILTERS */}
              <div className="col-span-1 md:col-span-2">
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
                  className="bg-white rounded-md mb-4"
                />
                
                {/* Filter chips */}
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  <Chip
                    label="Single"
                    onClick={() => handleFilterToggle('single')}
                    color={filters.single ? 'primary' : 'default'}
                  />
                  <Chip
                    label="Hiking"
                    onClick={() => handleFilterToggle('hiking')}
                    color={filters.hiking ? 'primary' : 'default'}
                  />
                  <Chip
                    label="Cooking"
                    onClick={() => handleFilterToggle('cooking')}
                    color={filters.cooking ? 'primary' : 'default'}
                  />
                  <Chip
                    label="Reading"
                    onClick={() => handleFilterToggle('reading')}
                    color={filters.reading ? 'primary' : 'default'}
                  />
                  <Chip
                    label="Travel"
                    onClick={() => handleFilterToggle('travel')}
                    color={filters.travel ? 'primary' : 'default'}
                  />
                  <Chip
                    label="Photography"
                    onClick={() => handleFilterToggle('photography')}
                    color={filters.photography ? 'primary' : 'default'}
                  />
                </div>
                
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  fullWidth
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out mb-6"
                >
                  Search
                </Button>
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between bg-white p-4 mt-4 rounded-md mb-4 transition-all duration-300 hover:bg-blue-100">
                      <Typography variant="body1" className="text-gray-800">
                        {(() => {
                          const profileData = result.profile_data;
                          const name = profileData?.personalInfo?.name || 'Name not available';
                          const location = profileData?.personalInfo?.location || 'Location not available';
                          return `${name} - ${location} (${result.distance} away)`;
                        })()}
                      </Typography>
                      <Button
                        onClick={() => handleViewProfile(result.id)}
                        variant="contained"
                        className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                      >
                        View Profile
                      </Button>
                    </div>
                  ))
                ) : (
                  searchInput && <Typography variant="body1" className="text-gray-800 mt-4">No matching profiles found</Typography>
                )}
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="fixed top-4 right-4 z-50"
              >
                <Button
                  onClick={() => navigate('/')}
                  variant="text"
                  className="text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
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
