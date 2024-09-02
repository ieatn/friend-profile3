// ProfileDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from './api/Config';

export default function ProfileDetail() {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await axios.get(`${API_URL}/profiles/${id}`);
        const data = result.data;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  const profileData = JSON.parse(profile.profile_data);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile Details</h1>
      <p>Name: {profileData.name}</p>
      <p>Age: {profileData.age}</p>
      <p>Email: {profileData.contact.email}</p>
      <p>Phone: {profileData.contact.phone}</p>
      <p>Hobbies: {profileData.hobbies.join(', ')}</p>
    </div>
  );
}
