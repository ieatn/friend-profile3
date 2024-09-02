import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import axios from 'axios'; // Ensure axios is imported
import { API_URL } from './api/Config'; // Ensure API_URL is configured

export default function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [hobbies, setHobbies] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the profile object
    const profileData = {
      name,
      age,
      contact: {
        email: contactEmail,
        phone: contactPhone,
      },
      hobbies,
    };

    // Convert profile data to JSON string
    const profileDataJson = JSON.stringify(profileData);


    try {
      console.log(profileData)
      console.log(typeof(profileData))
      console.log('Profile data:', profileDataJson);
      console.log('type:', typeof(profileDataJson));
      await axios.post(`${API_URL}/profiles`, { profile_data: profileDataJson });
      alert('Profile created successfully!');
      // Optionally, redirect or clear fields here
      handleClear();
    } catch (error) {
      console.error('There was an error creating the profile!', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  // Clear all form fields
  const handleClear = () => {
    setName('');
    setAge('');
    setContactEmail('');
    setContactPhone('');
    setHobbies([]);
  };

  // Generate default data for form fields
  const handleGenerateDefault = () => {
    setName('John Doe');
    setAge('25');
    setContactEmail('johndoe@example.com');
    setContactPhone('123-456-7890');
    setHobbies(['Reading', 'Gaming', 'Hiking']);
  };

  return (
    <div className="border w-1/2 mx-auto flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-8">Create Your Own Friend Profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <TextField
            label="Contact Email"
            type="email"
            variant="outlined"
            fullWidth
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <TextField
            label="Contact Phone"
            variant="outlined"
            fullWidth
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="hobbies-label">Hobbies</InputLabel>
            <Select
              labelId="hobbies-label"
              multiple
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              renderValue={(selected) => (
                <div className="flex flex-wrap">
                  {selected.map((value) => (
                    <div key={value} className="p-1">
                      {value}
                    </div>
                  ))}
                </div>
              )}
              label="Hobbies"
            >
              <MenuItem value="Reading">Reading</MenuItem>
              <MenuItem value="Gaming">Gaming</MenuItem>
              <MenuItem value="Hiking">Hiking</MenuItem>
              <MenuItem value="Cooking">Cooking</MenuItem>
              <MenuItem value="Traveling">Traveling</MenuItem>
              {/* Add more hobbies as needed */}
            </Select>
          </FormControl>
        </div>

        <div className="flex justify-between mb-4">
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outlined" color="success" onClick={handleGenerateDefault}>
            Generate Default
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Create Profile
          </Button>
        </div>
      </form>
      
      <Link to="/" className='fixed top-10 right-10'>
        <Button variant="contained">Home</Button>
      </Link>
      <Link to="/profile">
        <Button variant="contained">View Profiles</Button>
      </Link>
    </div>
  );
}
