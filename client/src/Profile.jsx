import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Chip, Typography, Box, Avatar, Switch } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { API_URL } from './api/Config';
import './App.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Profile() {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    try {
      const result = await axios.get(`${API_URL}/profiles`);
      const parsedProfiles = result.data.map(profile => ({
        ...profile,
        profile_data: JSON.parse(profile.profile_data)
      }));
      setProfiles(parsedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleDelete = async (profileId) => {
    try {
      await axios.delete(`${API_URL}/profiles/${profileId}`);
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const ProfileCard = ({ profile }) => {
    const [useRealisticPhoto, setUseRealisticPhoto] = useState(false);

    const avatarUrl = profile.profile_data.personalInfo.gender === 'Female'
      ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches
`
      : `https://api.dicebear.com/6.x/micah/svg?seed=${profile.profile_data.personalInfo.name}`;
    const realisticPhotoUrl = profile.profile_data.personalInfo.gender === 'Female'
      ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200"
      : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200";

    const handleTogglePhoto = () => {
      setUseRealisticPhoto(!useRealisticPhoto);
    };

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

    return (
      <Box 
        className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white
               h-full overflow-y-auto scrollbar-hide relative flex flex-col"
        sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
      >
        <Box className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl"></Box>
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
        
        <Box className="flex justify-between mt-8">
          <Link to={`/form/${profile.id}`}>
            <Button variant="contained" size="small" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">Edit</Button>
          </Link>
          <Button variant="contained" size="small" className="bg-red-500/70 hover:bg-red-600/70 backdrop-blur-sm" onClick={() => handleDelete(profile.id)}>Delete</Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="relative w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 to-indigo-200">
      <Box className="w-full max-w-lg h-[750px]">
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="h-full w-full"
        >
          {profiles.map((profile) => (
            <SwiperSlide key={profile.id}>
              <ProfileCard profile={profile} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Box className="absolute top-4 right-4 flex gap-2 z-10">
        <Link to="/">
          <Button variant="contained" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">Home</Button>
        </Link>
        <Link to="/form">
          <Button variant="contained" className="bg-green-500/70 hover:bg-green-600/70 backdrop-blur-sm">Create Profile</Button>
        </Link>
      </Box>
    </Box>
  );
}