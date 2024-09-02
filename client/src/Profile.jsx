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

      // IGNORE THIS IS FOR DEBUGGING
      // console.log(data[0].profile_data)
      // console.log(typeof(data[0].profile_data))
      // const str = JSON.parse(data[0].profile_data)
      // // Function to print object properties
      // const printProperties = (obj, prefix = '') => {
      //   for (const key in obj) {
      //     if (obj.hasOwnProperty(key)) {
      //       if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      //         // Recursive call for nested objects
      //         printProperties(obj[key], `${prefix}${key}.`);
      //       } else if (Array.isArray(obj[key])) {
      //         // Handling arrays
      //         console.log(`${prefix}${key}: [${obj[key].join(', ')}]`);
      //       } else {
      //         // Primitive values
      //         console.log(`${prefix}${key}: ${obj[key]}`);
      //       }
      //     }
      //   }
      // };

      // // Print all properties
      // printProperties(str);

      // Parse the profile_data field and update state
      const parsedProfiles = data.map(profile => {
        return {
          ...profile,
          profile_data: JSON.parse(profile.profile_data)
        };
      });

      // Set the parsed profiles to the state
      setProfiles(parsedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((profile, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Name: {profile.profile_data.name}</h2>
            <p className="text-lg text-gray-700">Age: {profile.profile_data.age}</p>
            <p className="text-lg text-gray-700">Email: {profile.profile_data.contact.email}</p>
            <p className="text-lg text-gray-700">Phone: {profile.profile_data.contact.phone}</p>
            <p className="text-lg text-gray-700">Hobbies: {profile.profile_data.hobbies.join(', ')}</p>
          </div>
        ))}
      </div>
      <Link to="/" className='fixed top-10 right-10'>
        <Button variant="contained">Home</Button>
      </Link>
      <Link to="/form" className='mt-4'>
        <Button variant="contained">Form</Button>
      </Link>
    </div>
  );
}
