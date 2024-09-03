import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, TextField, InputLabel, MenuItem, Select, FormControl, Chip } from '@mui/material';
import axios from 'axios';
import { API_URL } from './api/Config';

export default function Form() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    location: '',
    relationshipStatus: '',
  });

  const [lifestyle, setLifestyle] = useState({
    occupation: '',
    values: [],
    goals: '',
  });

  const [interests, setInterests] = useState({
    hobbies: [],
    favoriteActivities: [],
    favoriteMedia: [],
  });

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/profiles/${id}`)
        .then(response => {
          const profile = response.data;
          const profileData = JSON.parse(profile.profile_data);
          setPersonalInfo(profileData.personalInfo);
          setLifestyle(profileData.lifestyle);
          setInterests(profileData.interests);
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = JSON.stringify({
      personalInfo,
      lifestyle,
      interests,
    });

    try {
      if (id) {
        await axios.put(`${API_URL}/profiles/${id}`, { profile_data: profileData });
      } else {
        await axios.post(`${API_URL}/profiles`, { profile_data: profileData });
      }
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleClear = () => {
    setPersonalInfo({ name: '', age: '', location: '', relationshipStatus: '' });
    setLifestyle({ occupation: '', values: [], goals: '' });
    setInterests({ hobbies: [], favoriteActivities: [], favoriteMedia: [] });
  };

  const handleGenerateDefault = () => {
    setPersonalInfo({
      name: 'John Doe',
      age: '30',
      location: 'New York, NY',
      relationshipStatus: 'Single',
    });
    setLifestyle({
      occupation: 'Software Developer',
      values: ['Honesty', 'Creativity', 'Growth'],
      goals: 'Learn a new language, travel to Japan',
    });
    setInterests({
      hobbies: ['Photography', 'Cooking', 'Yoga'],
      favoriteActivities: ['Hiking', 'Beach trips', 'Board games'],
      favoriteMedia: ['Sci-fi movies', 'Jazz music', 'Mystery novels'],
    });
  };

  return (
    <div className="border w-3/4 mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl mb-8">Create Your Friend Profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="mb-8">
          <h2 className="text-xl mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Name"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              value={personalInfo.age}
              onChange={(e) => setPersonalInfo({...personalInfo, age: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Location"
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
              fullWidth
            />
            <TextField
              label="Relationship Status"
              value={personalInfo.relationshipStatus}
              onChange={(e) => setPersonalInfo({...personalInfo, relationshipStatus: e.target.value})}
              fullWidth
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl mb-4">Lifestyle</h2>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Occupation"
              value={lifestyle.occupation}
              onChange={(e) => setLifestyle({...lifestyle, occupation: e.target.value})}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Values</InputLabel>
              <Select
                multiple
                value={lifestyle.values}
                onChange={(e) => setLifestyle({...lifestyle, values: e.target.value})}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </div>
                )}
              >
                {['Honesty', 'Creativity', 'Growth', 'Adventure', 'Family', 'Kindness'].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Goals"
              value={lifestyle.goals}
              onChange={(e) => setLifestyle({...lifestyle, goals: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl mb-4">Interests</h2>
          <div className="grid grid-cols-1 gap-4">
            <FormControl fullWidth>
              <InputLabel>Hobbies</InputLabel>
              <Select
                multiple
                value={interests.hobbies}
                onChange={(e) => setInterests({...interests, hobbies: e.target.value})}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </div>
                )}
              >
                {['Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Sports'].map((hobby) => (
                  <MenuItem key={hobby} value={hobby}>
                    {hobby}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Favorite Activities"
              value={interests.favoriteActivities.join(', ')}
              onChange={(e) => setInterests({...interests, favoriteActivities: e.target.value.split(', ')})}
              fullWidth
              helperText="Separate activities with commas"
            />
            <TextField
              label="Favorite Media"
              value={interests.favoriteMedia.join(', ')}
              onChange={(e) => setInterests({...interests, favoriteMedia: e.target.value.split(', ')})}
              fullWidth
              helperText="Separate media types with commas (e.g., movies, books, music)"
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outlined" color="primary" onClick={handleGenerateDefault}>
            Generate Default
          </Button>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="contained" color="primary" type="submit" size="large">
            {id ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </form>
      
      <div className="mt-8 space-x-4">
        <Link to="/">
          <Button variant="contained">Home</Button>
        </Link>
        <Link to="/profile">
          <Button variant="outlined">Your Profiles</Button>
        </Link>
      </div>
    </div>
  );
}