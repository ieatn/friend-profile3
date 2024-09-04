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
    favoriteFood: '',
    favoriteRestaurants: '',
    sports: '',
    accomplishments: '',
  });

  const [lifestyle, setLifestyle] = useState({
    occupation: '',
    values: [],
    goals: '',
    financialGoals: '',
    financialSituation: '',
    favoriteCauses: '',
  });

  const [interests, setInterests] = useState({
    hobbies: [],
    favoriteActivities: [],
    favoriteMedia: [],
    favoriteTVShows: '',
    favoriteGames: '',
    favoriteBooks: '',
    favoriteQuotes: '',
  });

  const [contact, setContact] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
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
          setContact(profileData.contact);
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
      contact,
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
    setPersonalInfo({ name: '', age: '', location: '', relationshipStatus: '', favoriteFood: '', favoriteRestaurants: '', sports: '', accomplishments: '' });
    setLifestyle({ occupation: '', values: [], goals: '', financialGoals: '', financialSituation: '', favoriteCauses: '' });
    setInterests({ hobbies: [], favoriteActivities: [], favoriteMedia: [], favoriteTVShows: '', favoriteGames: '', favoriteBooks: '', favoriteQuotes: '' });
    setContact({ facebook: '', instagram: '', twitter: '', linkedin: '' });
  };

  const handleGenerateDefault = () => {
    setPersonalInfo({
      name: 'John Doe',
      age: '30',
      location: 'New York, NY',
      relationshipStatus: 'Single',
      favoriteFood: 'Italian cuisine, sushi',
      favoriteRestaurants: 'Olive Garden, Nobu',
      sports: 'Basketball, Tennis',
      accomplishments: 'Ran a marathon, Published a book',
    });
    setLifestyle({
      occupation: 'Software Developer',
      values: ['Honesty', 'Creativity', 'Growth'],
      goals: 'Learn a new language, travel to Japan',
      financialGoals: 'Save for retirement, Buy a house',
      financialSituation: 'Stable, focusing on investments',
      favoriteCauses: 'Environmental conservation, Education for all',
    });
    setInterests({
      hobbies: ['Photography', 'Cooking', 'Yoga'],
      favoriteActivities: ['Hiking', 'Beach trips', 'Board games'],
      favoriteMedia: ['Sci-fi movies', 'Jazz music', 'Mystery novels'],
      favoriteTVShows: 'Stranger Things, The Office, Breaking Bad',
      favoriteGames: 'The Legend of Zelda, Chess, Sudoku',
      favoriteBooks: '1984 by George Orwell, To Kill a Mockingbird by Harper Lee',
      favoriteQuotes: '"Be the change you wish to see in the world." - Mahatma Gandhi',
    });
    setContact({
      facebook: 'https://facebook.com/johndoe',
      instagram: 'https://instagram.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
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
            <TextField
              label="Favorite Food"
              value={personalInfo.favoriteFood}
              onChange={(e) => setPersonalInfo({...personalInfo, favoriteFood: e.target.value})}
              fullWidth
            />
            <TextField
              label="Favorite Restaurants"
              value={personalInfo.favoriteRestaurants}
              onChange={(e) => setPersonalInfo({...personalInfo, favoriteRestaurants: e.target.value})}
              fullWidth
            />
            <TextField
              label="Sports"
              value={personalInfo.sports}
              onChange={(e) => setPersonalInfo({...personalInfo, sports: e.target.value})}
              fullWidth
            />
            <TextField
              label="Accomplishments"
              value={personalInfo.accomplishments}
              onChange={(e) => setPersonalInfo({...personalInfo, accomplishments: e.target.value})}
              fullWidth
              multiline
              rows={2}
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
            <TextField
              label="Financial Goals"
              value={lifestyle.financialGoals}
              onChange={(e) => setLifestyle({...lifestyle, financialGoals: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Financial Situation"
              value={lifestyle.financialSituation}
              onChange={(e) => setLifestyle({...lifestyle, financialSituation: e.target.value})}
              fullWidth
            />
            <TextField
              label="Favorite Causes/Non-Profits"
              value={lifestyle.favoriteCauses}
              onChange={(e) => setLifestyle({...lifestyle, favoriteCauses: e.target.value})}
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
            <TextField
              label="Favorite TV Shows"
              value={interests.favoriteTVShows}
              onChange={(e) => setInterests({...interests, favoriteTVShows: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Favorite Games"
              value={interests.favoriteGames}
              onChange={(e) => setInterests({...interests, favoriteGames: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Favorite Books"
              value={interests.favoriteBooks}
              onChange={(e) => setInterests({...interests, favoriteBooks: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Favorite Quotes"
              value={interests.favoriteQuotes}
              onChange={(e) => setInterests({...interests, favoriteQuotes: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Facebook"
              value={contact.facebook}
              onChange={(e) => setContact({...contact, facebook: e.target.value})}
              fullWidth
            />
            <TextField
              label="Instagram"
              value={contact.instagram}
              onChange={(e) => setContact({...contact, instagram: e.target.value})}
              fullWidth
            />
            <TextField
              label="Twitter"
              value={contact.twitter}
              onChange={(e) => setContact({...contact, twitter: e.target.value})}
              fullWidth
            />
            <TextField
              label="LinkedIn"
              value={contact.linkedin}
              onChange={(e) => setContact({...contact, linkedin: e.target.value})}
              fullWidth
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