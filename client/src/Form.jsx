import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Button, TextField, InputLabel, MenuItem, Select, FormControl, Chip } from '@mui/material';
import axios from 'axios';
import { API_URL } from './api/Config';
import { useUser } from './contexts/UserContext';

export default function Form() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { currentUserId } = useUser();


  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUserId) {
        try {
          const response = await axios.get(`${API_URL}/profiles/${currentUserId}`);
          const parsedProfileData = JSON.parse(response.data.profile_data);
          if (parsedProfileData && Object.keys(parsedProfileData).length > 0) {
            setProfileData(parsedProfileData);
            // Fill in all the fields with the fetched data
            setPersonalInfo(parsedProfileData.personalInfo || {});
            setLifestyle(parsedProfileData.lifestyle || {});
            setInterests(parsedProfileData.interests || {});
            setContact(parsedProfileData.contact || {});
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfileData();
  }, [currentUserId]);

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    location: '',
    relationshipStatus: '',
    favoriteFood: '',
    favoriteRestaurants: '',
    sports: '',
    accomplishments: '',
    spiritualReligious: '',
    aboutMe: '',
    tagline: '',
    gender: '',
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
    phone: '',
    email: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = JSON.stringify({
      personalInfo,
      lifestyle,
      interests,
      contact,
    });

    try {
      if (currentUserId) {
        await axios.put(`${API_URL}/profiles/${currentUserId}`, { profile_data: profileData });
      } else {
        const response = await axios.post(`${API_URL}/profiles`, { 
          profile_data: profileData,
          user_id: user.sub
        });
        // Note: This line is not needed as currentUserId is from useUser hook
        // currentUserId = response.data.id;
      }
      navigate(`/profile/${currentUserId}`);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleClear = () => {
    setPersonalInfo({ name: '', age: '', location: '', relationshipStatus: '', favoriteFood: '', favoriteRestaurants: '', sports: '', accomplishments: '', spiritualReligious: '', aboutMe: '', tagline: '', gender: '' });
    setLifestyle({ occupation: '', values: [], goals: '', financialGoals: '', financialSituation: '', favoriteCauses: '' });
    setInterests({ hobbies: [], favoriteActivities: [], favoriteMedia: [], favoriteTVShows: '', favoriteGames: '', favoriteBooks: '', favoriteQuotes: '' });
    setContact({ facebook: '', instagram: '', twitter: '', linkedin: '', phone: '', email: '' });
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
      spiritualReligious: 'Christian',
      aboutMe: 'I am a passionate individual with a love for learning and exploring new experiences. I enjoy spending time with friends and family, and I am always looking for new opportunities to grow and improve myself.',
      tagline: 'Embrace the journey, not the destination.',
      gender: 'Male',
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
      phone: '(555) 123-4567',
      email: 'johndoe@example.com',
    });
  };

  const handleGenerateDefaultFemale = () => {
    setPersonalInfo({
      name: 'Jane Smith',
      age: '28',
      location: 'San Francisco, CA',
      relationshipStatus: 'Single',
      favoriteFood: 'Mexican cuisine, Thai food',
      favoriteRestaurants: 'La Taqueria, Lers Ros Thai',
      sports: 'Yoga, Swimming',
      accomplishments: 'Started a successful startup, Climbed Mount Kilimanjaro',
      spiritualReligious: 'Buddhist',
      aboutMe: 'I am an adventurous spirit with a passion for technology and the outdoors. I love challenging myself, whether it\'s in my career or on a mountain trail. Always eager to learn and grow, I believe in making a positive impact on the world.',
      tagline: 'Innovate, explore, inspire.',
      gender: 'Female',
    });
    setLifestyle({
      occupation: 'Tech Entrepreneur',
      values: ['Innovation', 'Sustainability', 'Empathy'],
      goals: 'Launch a tech product that improves lives, Visit all 7 continents',
      financialGoals: 'Achieve financial independence, Fund a scholarship program',
      financialSituation: 'Growing startup, reinvesting profits',
      favoriteCauses: 'Women in STEM, Ocean conservation',
    });
    setInterests({
      hobbies: ['Coding', 'Rock climbing', 'Meditation', 'Cooking'],
      favoriteActivities: ['Backpacking', 'Attending tech conferences', 'Farmers markets', 'Cooking'],
      favoriteMedia: ['TED Talks', 'Indie films', 'Podcasts'],
      favoriteTVShows: 'Black Mirror, The Marvelous Mrs. Maisel, Planet Earth',
      favoriteGames: 'Portal, Civilization, Sudoku',
      favoriteBooks: 'Lean In by Sheryl Sandberg, Dune by Frank Herbert',
      favoriteQuotes: '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    });
    setContact({
      facebook: 'https://facebook.com/janesmith',
      instagram: 'https://instagram.com/janesmith',
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      phone: '(415) 555-7890',
      email: 'janesmith@example.com',
    });
  };

  return (
    <div className="border w-3/4 mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-3xl mb-8">{currentUserId ? 'Edit' : 'Create'} Your Friend Profile</h1>
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
            <TextField
              label="Spiritual/Religious Views"
              value={personalInfo.spiritualReligious}
              onChange={(e) => setPersonalInfo({...personalInfo, spiritualReligious: e.target.value})}
              fullWidth
            />
            <TextField
              label="Tagline"
              value={personalInfo.tagline}
              onChange={(e) => setPersonalInfo({...personalInfo, tagline: e.target.value})}
              fullWidth
              helperText="A short phrase about you"
            />
            <TextField
              label="About Me"
              value={personalInfo.aboutMe}
              onChange={(e) => setPersonalInfo({...personalInfo, aboutMe: e.target.value})}
              fullWidth
              multiline
              rows={3}
              className="col-span-2"
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
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
          <h2 className="text-xl mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Phone Number"
              value={contact.phone}
              onChange={(e) => setContact({...contact, phone: e.target.value})}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={contact.email}
              onChange={(e) => setContact({...contact, email: e.target.value})}
              fullWidth
            />
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
            Generate Default Male
          </Button>
          <Button variant="outlined" color="primary" onClick={handleGenerateDefaultFemale}>
            Generate Default Female
          </Button>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="contained" color="primary" type="submit" size="large">
            {!profileData || Object.keys(profileData).length === 0 ? 'Create Profile' : 'Update Profile'}
          </Button>
        </div>
      </form>
      
      <div className="fixed top-4 right-4 space-x-4">
        <Link to="/app">
          <Button variant="contained">Home</Button>
        </Link>
        {currentUserId && (
          <Button 
            variant="outlined" 
            onClick={() => {
              if (!profileData || Object.keys(profileData).length === 0) {
                alert("No profile available.");
              } else {
                navigate(`/profile/${currentUserId}`);
              }
            }}
          >
            Your Profile
          </Button>
        )}
      </div>
    </div>
  );
}