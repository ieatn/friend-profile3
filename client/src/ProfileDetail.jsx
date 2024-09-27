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
import { useUser } from './contexts/UserContext';
import ProfileCard from './ProfileCard'; // Import the new ProfileCard component

export default function ProfileDetail() {
  // debugging
  // for params to work, must use the right term, ill call it newId
  // actually this doesnt even fucking work, maybe its stuck at id because of the route in index.js
  const params = useParams();
  console.log(params)
  const { id } = params;
  const { currentUserId } = useUser();
  console.log(id)
  const isCurrentUser = id === currentUserId;
  const [profile, setProfile] = useState(null);
  const [useRealisticPhoto, setUseRealisticPhoto] = useState(false);
  
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
  }, [id, currentUserId]); // Add id as a dependency


  // if profile is not loaded, show loading message
  if (!profile) return <Typography>Loading...</Typography>;

  // has to load after profile is loaded or else bug
  const name = profile.profile_data.personalInfo.name;
  const isDefaultUser = name === 'John Doe' || name === 'Jane Smith';
  
  const avatarUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? `https://api.dicebear.com/9.x/adventurer/svg?seed=Patches`
    : `https://api.dicebear.com/6.x/micah/svg?seed=${profile.profile_data.personalInfo.name}`;
  const realisticPhotoUrl = profile.profile_data.personalInfo.gender === 'Female'
    ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200"
    : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200";

  const handleTogglePhoto = () => {
    setUseRealisticPhoto(!useRealisticPhoto);
  };

  const handleDelete = async (unique_id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this profile?");
    if (isConfirmed) {
      try {
        await axios.delete(`${API_URL}/profiles/${unique_id}`);
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  return (
    <Box className="relative w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 to-indigo-200">
      <Box className="w-full max-w-lg h-[750px] scrollbar-hide" sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        <Box className="">
          <ProfileCard // Use the new ProfileCard component
            profile={profile}
            useRealisticPhoto={useRealisticPhoto}
            handleTogglePhoto={handleTogglePhoto}
            isDefaultUser={isDefaultUser}
            name={name}
          />
        </Box>
      </Box>
      <Box className="absolute top-4 right-4 flex gap-2 z-10">
        <Link to="/app">
          <Button variant="contained" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">Home</Button>
        </Link>
        {isCurrentUser && (
          <>
            <Button variant="contained" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" onClick={() => navigate(`/form/${currentUserId}`)}>Edit</Button>
            <Button variant="contained" className="bg-red-500/70 hover:bg-red-600/70 backdrop-blur-sm" onClick={() => handleDelete(profile.unique_id)}>Delete</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
