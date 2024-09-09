import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Chip, Typography, Box, Switch, TextField } from '@mui/material';
import { API_URL } from './api/Config';
import './App.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [useRealisticPhoto, setUseRealisticPhoto] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();

  const renderInterestItem = (label, value) => {
    if (value && value.length > 0) {
      return <InfoItem label={label} value={value} />;
    }
    return null;
  };

  const renderSection = (title, icon, children) => (
    <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
      <Typography variant="h6" className="font-bold mb-3 flex items-center">
        <span className="mr-2">{icon}</span> {title}
      </Typography>
      <Box className="space-y-2">{children}</Box>
    </Box>
  );
  const InfoItem = ({ label, value }) => (
    <Box className="text-sm flex items-center">
      <Typography variant="subtitle2" component="span" className="font-semibold text-white/80 mr-2">{label}</Typography>
      <Typography component="span" className="text-white">{value}</Typography>
    </Box>
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await axios.get(`${API_URL}/profiles/${id}`);
        const parsedProfile = {
          ...result.data,
          profile_data: JSON.parse(result.data.profile_data)
        };
        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <Typography>Loading...</Typography>;

  const avatarUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches`
    : `https://api.dicebear.com/6.x/micah/svg?seed=${profile.profile_data.personalInfo.name}`;
  const realisticPhotoUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200"
    : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200";

  const handleTogglePhoto = () => {
    setUseRealisticPhoto(!useRealisticPhoto);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles/search?keyword=${searchKeyword}`);
      setSearchResult(response.data);
      const profileData = JSON.parse(response.data.profile_data);
      console.log(profileData.personalInfo.name);
      setSearchKeyword(''); // Clear the search field after successful search
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResult({ message: 'No matching profile found' });
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <Box className="relative w-full h-screen  flex justify-center items-center bg-gradient-to-br from-purple-200 to-indigo-200">
      <Box className="w-full max-w-lg h-[750px] scrollbar-hide" sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        <Box 
          className="overflow-y-auto bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white
                 h-full relative flex flex-col"
          sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
        >
          <Box className="flex justify-end mb-4">
          <Typography component="span" className="mr-2 text-sm">Avatar</Typography>
          <Switch
            checked={useRealisticPhoto}
            onChange={handleTogglePhoto}
            color="default"
            size="small"
          />
          <Typography component="span" className="ml-2 text-sm">Realistic</Typography>
        </Box>
        <Box
          component="img"
          src={useRealisticPhoto ? realisticPhotoUrl : avatarUrl}
          alt={profile.profile_data.personalInfo.name}
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '4px solid white',
            marginBottom: 4,
            objectFit: 'cover',
          }}
          className="mx-auto shadow-lg"
        />
        <Typography variant="h4" component="h2" className="mb-6 font-bold text-center">
          {profile.profile_data.personalInfo.name}
        </Typography>
        
        {profile.profile_data.personalInfo.tagline && (
          <Typography variant="subtitle1" className="mb-4 text-center italic">
            "{profile.profile_data.personalInfo.tagline}"
          </Typography>
        )}
        <Box className="space-y-8">
          {renderSection("About Me", "📝", (
            <Typography>
              {profile.profile_data.personalInfo.aboutMe}
            </Typography>
          ))}

          {renderSection("Personal Info", "👤", (
            <>
              {renderInterestItem("Age:", profile.profile_data.personalInfo.age)}
              {renderInterestItem("Location:", profile.profile_data.personalInfo.location)}
              {renderInterestItem("Relationship Status:", profile.profile_data.personalInfo.relationshipStatus)}
              {renderInterestItem("Spiritual/Religious Views:", profile.profile_data.personalInfo.spiritualReligious)}
              {renderInterestItem("Favorite Food:", profile.profile_data.personalInfo.favoriteFood)}
              {renderInterestItem("Favorite Restaurants:", profile.profile_data.personalInfo.favoriteRestaurants)}
              {renderInterestItem("Sports:", profile.profile_data.personalInfo.sports)}
              {renderInterestItem("Accomplishments:", profile.profile_data.personalInfo.accomplishments)}
            </>
          ))}
          
          {renderSection("Lifestyle", "🌟", (
            <>
              {renderInterestItem("Occupation:", profile.profile_data.lifestyle.occupation)}
              {renderInterestItem("Goals:", profile.profile_data.lifestyle.goals)}
              {renderInterestItem("Financial Goals:", profile.profile_data.lifestyle.financialGoals)}
              {renderInterestItem("Favorite Causes:", profile.profile_data.lifestyle.favoriteCauses)}
              <Box>
                <Typography variant="subtitle2" className="font-semibold mb-2">Values:</Typography>
                <Box className="flex flex-wrap gap-2">
                  {profile.profile_data.lifestyle.values.map((value, idx) => (
                    <Chip key={idx} label={value} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
                  ))}
                </Box>
              </Box>
            </>
          ))}
          
          {renderSection("Interests", "❤️", (
            <>
              <Box>
                <Typography variant="subtitle2" className="font-semibold mb-2">Hobbies:</Typography>
                <Box className="flex flex-wrap gap-2">
                  {profile.profile_data.interests.hobbies.map((hobby, idx) => (
                    <Chip key={idx} label={hobby} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
                  ))}
                </Box>
              </Box>
              {renderInterestItem("Favorite Activities:", profile.profile_data.interests.favoriteActivities.join(', '))}
              {renderInterestItem("Favorite Media:", profile.profile_data.interests.favoriteMedia.join(', '))}
              
              {renderInterestItem("Favorite TV Shows:", profile.profile_data.interests.favoriteTVShows)}
              {renderInterestItem("Favorite Games:", profile.profile_data.interests.favoriteGames)}
              {renderInterestItem("Favorite Books:", profile.profile_data.interests.favoriteBooks)}
              {renderInterestItem("Favorite Quotes:", profile.profile_data.interests.favoriteQuotes)}
            </>
          ))}

          {renderSection("Contact", "📱", (
            <Box className="space-y-2">
              {profile.profile_data.contact && (
                <>
                  {renderInterestItem(<EmailIcon fontSize="small" sx={{ color: '#EA4335', marginRight: '8px' }} />, profile.profile_data.contact.email)}
                  <Box my={1} />
                  {renderInterestItem(<PhoneIcon fontSize="small" sx={{ color: '#34A853', marginRight: '8px' }} />, profile.profile_data.contact.phone)}
                  <Box my={1} />
                  {renderInterestItem(<FacebookIcon fontSize="small" sx={{ color: '#1877F2', marginRight: '8px' }} />, profile.profile_data.contact.facebook)}
                  <Box my={1} />
                  {renderInterestItem(<InstagramIcon fontSize="small" sx={{ color: '#E4405F', marginRight: '8px' }} />, profile.profile_data.contact.instagram)}
                  <Box my={1} />
                  {renderInterestItem(<TwitterIcon fontSize="small" sx={{ color: '#1DA1F2', marginRight: '8px' }} />, profile.profile_data.contact.twitter)}
                  <Box my={1} />
                  {renderInterestItem(<LinkedInIcon fontSize="small" sx={{ color: '#0A66C2', marginRight: '8px' }} />, profile.profile_data.contact.linkedin)}
                </>
              )}
            </Box>
          ))}
        </Box>
        </Box>
      </Box>
      <Box className="absolute top-4 right-4 flex gap-2 z-10">
        <Link to="/">
          <Button variant="contained" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">Home</Button>
        </Link>
        <Link to="/profiles">
          <Button variant="contained" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">All Profiles</Button>
        </Link>
      </Box>
      {/* <Box className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 w-64">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search profiles..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="bg-white rounded-md mb-4"
          size="small"
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          size="small"
        >
          Search
        </Button>
      </Box>
      {searchResult && searchResult.id && (
        <Box className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-64 bg-white p-4 rounded-md shadow-md">
          <Typography variant="body2" className="text-gray-800 mb-2">
            {(() => {
              if (searchResult.id) {
                const profileData = JSON.parse(searchResult.profile_data);
                const name = profileData?.personalInfo?.name || 'Name not available';
                const location = profileData?.personalInfo?.location || 'Location not available';
                return `${name} - ${location}`;
              }
              return 'Profile information not available';
            })()}
          </Typography>
          <Button
            onClick={() => {
              handleViewProfile(searchResult.id);
              setSearchResult(null);
              setSearchKeyword('');
            }}
            variant="contained"
            fullWidth
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            size="small"
          >
            View Profile
          </Button>
        </Box>
      )} */}
    </Box>
  );
}
