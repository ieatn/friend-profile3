import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import axios from 'axios';
import { API_URL } from './api/Config';

export default function Form() {
  const { id } = useParams(); // Get profile ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [hobbies, setHobbies] = useState([]);

  // Fetch profile data if ID is provided
  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/profiles/${id}`)
        .then(response => {
          const profile = response.data;
          const profileData = JSON.parse(profile.profile_data);
          setName(profileData.name);
          setAge(profileData.age);
          setContactEmail(profileData.contact.email);
          setContactPhone(profileData.contact.phone);
          setHobbies(profileData.hobbies);
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = JSON.stringify({
      name,
      age,
      contact: {
        email: contactEmail,
        phone: contactPhone
      },
      hobbies
    });

    try {
      if (id) {
        // Update existing profile
        await axios.put(`${API_URL}/profiles/${id}`, { profile_data: profileData });
      } else {
        // Create new profile
        await axios.post(`${API_URL}/profiles`, { profile_data: profileData });
      }
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Error saving profile:', error);
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
        </div>

        <div className="flex justify-end">
          <Button variant="contained" color="primary" type="submit">
            {id ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </form>
      
      <Link to="/" className='fixed top-10 right-10'>
        <Button variant="contained">Home</Button>
      </Link>
      <Link to="/profile">
        <Button variant="contained">Profile</Button>
      </Link>
    </div>
  );
}
