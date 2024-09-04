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

    const avatarUrl = `https://api.dicebear.com/6.x/micah/svg?seed=${profile.profile_data.personalInfo.name}`;
    const realisticPhotoUrl = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200";

    const handleTogglePhoto = () => {
      setUseRealisticPhoto(!useRealisticPhoto);
    };

    const renderInterestItem = (label, value) => {
      if (value && value.length > 0) {
        return <InfoItem label={label} value={value} />;
      }
      return null;
    };

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
        
        <Box className="space-y-6">
          <Section title="Personal Info" icon="👤">
            <InfoItem label="Age" value={profile.profile_data.personalInfo.age} />
            <InfoItem label="Location" value={profile.profile_data.personalInfo.location} />
            <InfoItem label="Status" value={profile.profile_data.personalInfo.relationshipStatus} />
          </Section>
          
          <Section title="Lifestyle" icon="🌟">
            <InfoItem label="Occupation" value={profile.profile_data.lifestyle.occupation} />
            <InfoItem label="Goals" value={profile.profile_data.lifestyle.goals} />
            <Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">Values:</Typography>
              <Box className="flex flex-wrap gap-2">
                {profile.profile_data.lifestyle.values.map((value, idx) => (
                  <Chip key={idx} label={value} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
                ))}
              </Box>
            </Box>
          </Section>
          
          <Section title="Interests" icon="❤️">
            <Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">Hobbies:</Typography>
              <Box className="flex flex-wrap gap-2">
                {profile.profile_data.interests.hobbies.map((hobby, idx) => (
                  <Chip key={idx} label={hobby} size="small" className="bg-white/20 text-white backdrop-blur-sm" />
                ))}
              </Box>
            </Box>
            {renderInterestItem("Favorite Activities", profile.profile_data.interests.favoriteActivities.join(', '))}
            {renderInterestItem("Favorite Media", profile.profile_data.interests.favoriteMedia.join(', '))}
            
            {renderInterestItem("Favorite TV Shows", profile.profile_data.interests.favoriteTVShows)}
            {renderInterestItem("Favorite Games", profile.profile_data.interests.favoriteGames)}
            {renderInterestItem("Favorite Books", profile.profile_data.interests.favoriteBooks)}
            {renderInterestItem("Favorite Quotes", profile.profile_data.interests.favoriteQuotes)}
          </Section>
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

  const Section = ({ title, icon, children }) => (
    <Box className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
      <Typography variant="h6" className="font-bold mb-3 flex items-center">
        <span className="mr-2">{icon}</span> {title}
      </Typography>
      <Box className="space-y-2">{children}</Box>
    </Box>
  );

  const InfoItem = ({ label, value }) => (
    <Box className="text-sm">
      <Typography variant="subtitle2" component="span" className="font-semibold text-white/80">{label}: </Typography>
      <Typography component="span" className="text-white">{value}</Typography>
    </Box>
  );

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