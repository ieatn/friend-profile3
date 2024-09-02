import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Form() {
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="border w-1/2 mx-auto flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-8">Create Your Own Friend Profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name:</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
      </form>

      
      <Link to="/" className='fixed top-10 right-10'><Button variant="contained">Home</Button></Link>
      <Link to="/profile"><Button variant="contained">Create Profile</Button></Link>
        
    </div>
  )
}
