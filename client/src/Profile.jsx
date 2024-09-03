import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Chip, Typography, Box } from '@mui/material';
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

  const ProfileCard = ({ profile }) => (
    <Box 
      className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl shadow-2xl p-6 text-white
             h-full overflow-hidden custom-scrollbar hover:overflow-y-auto"
    >
      <Typography variant="h4" component="h2" className="mb-4 font-bold truncate">
        {profile.profile_data.personalInfo.name}
      </Typography>
      
      <Box className="space-y-4">
        <Section title="Personal Info">
          <InfoItem label="Age" value={profile.profile_data.personalInfo.age} />
          <InfoItem label="Location" value={profile.profile_data.personalInfo.location} />
          <InfoItem label="Status" value={profile.profile_data.personalInfo.relationshipStatus} />
        </Section>
        
        <Section title="Lifestyle">
          <InfoItem label="Occupation" value={profile.profile_data.lifestyle.occupation} />
          <InfoItem label="Goals" value={profile.profile_data.lifestyle.goals} />
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-1">Values:</Typography>
            <Box className="flex flex-wrap gap-1">
              {profile.profile_data.lifestyle.values.map((value, idx) => (
                <Chip key={idx} label={value} size="small" className="bg-white text-purple-600 text-xs" />
              ))}
            </Box>
          </Box>
        </Section>
        
        <Section title="Interests">
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-1">Hobbies:</Typography>
            <Box className="flex flex-wrap gap-1">
              {profile.profile_data.interests.hobbies.map((hobby, idx) => (
                <Chip key={idx} label={hobby} size="small" className="bg-white text-purple-600 text-xs" />
              ))}
            </Box>
          </Box>
          <InfoItem label="Favorite Activities" value={profile.profile_data.interests.favoriteActivities.join(', ')} />
          <InfoItem label="Favorite Media" value={profile.profile_data.interests.favoriteMedia.join(', ')} />
        </Section>
      </Box>
      
      <Box className="flex justify-between mt-4">
        <Link to={`/form/${profile.id}`}>
          <Button variant="contained" size="small" className="bg-white text-purple-600 hover:bg-purple-100">Edit</Button>
        </Link>
        <Button variant="contained" size="small" className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(profile.id)}>Delete</Button>
      </Box>
    </Box>
  );

  const Section = ({ title, children }) => (
    <Box>
      <Typography variant="h6" className="font-bold mb-2">{title}</Typography>
      <Box className="space-y-1">{children}</Box>
    </Box>
  );

  const InfoItem = ({ label, value }) => (
    <Box className="text-sm">
      <Typography variant="subtitle2" component="span" className="font-semibold">{label}: </Typography>
      <Typography component="span">{value}</Typography>
    </Box>
  );

  return (
    <Box className="relative w-full h-screen flex justify-center items-center bg-gray-100">
      <Box className="w-full max-w-sm h-[600px]">
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
          <Button variant="contained" className="bg-white text-purple-600 hover:bg-purple-100">Home</Button>
        </Link>
        <Link to="/form">
          <Button variant="contained" className="bg-green-500 hover:bg-green-600">Create Profile</Button>
        </Link>
      </Box>
    </Box>
  );
}