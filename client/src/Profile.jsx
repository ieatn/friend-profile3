import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { API_URL } from './api/Config';

export default function Profile() {
  const [profiles, setProfiles] = useState([]);

  // Function to fetch all profiles
  const fetchProfiles = async () => {
    try {
      const result = await axios.get(`${API_URL}/profiles`);
      const data = result.data;
      const parsedProfiles = data.map(profile => {
        return {
          ...profile,
          profile_data: JSON.parse(profile.profile_data)
        };
      });
      setProfiles(parsedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Function to delete a profile
  const handleDelete = async (profileId) => {
    try {
      await axios.delete(`${API_URL}/profiles/${profileId}`);
      // Refresh profiles after deletion
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Name: {profile.profile_data.name}</h2>
            <p className="text-lg text-gray-700">Age: {profile.profile_data.age}</p>
            <p className="text-lg text-gray-700">Email: {profile.profile_data.contact.email}</p>
            <p className="text-lg text-gray-700">Phone: {profile.profile_data.contact.phone}</p>
            <p className="text-lg text-gray-700">Hobbies: {profile.profile_data.hobbies.join(', ')}</p>
            <div className="flex space-x-2 mt-4">
              <Link to={`/form/${profile.id}`} className=''>
                <Button variant="contained" color="primary">Edit</Button>
              </Link>
              <Button variant="contained" color="secondary" onClick={() => handleDelete(profile.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/" className='fixed top-10 right-10'>
        <Button variant="contained">Home</Button>
      </Link>
      <Link to="/form" className='mt-4'>
        <Button variant="contained">Create Profile</Button>
      </Link>
    </div>
  );
}
