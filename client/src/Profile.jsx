import { useState, useContext } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Profile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4">Name</h2>
          <p className="text-lg text-gray-700">{name}</p>
        </div>
      </div>
      <Link to="/" className='fixed top-10 right-10'><Button variant="contained">Home</Button></Link>
      <Link to="/form" className='mt-4'><Button variant="contained">Form</Button></Link>
    </div>
  )
}
