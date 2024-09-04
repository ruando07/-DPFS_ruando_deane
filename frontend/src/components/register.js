import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('profileImage', formData.profileImage);

    axios.post('/api/users/register', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      console.log('Registration successful:', response.data);
      // Redirect to login or home
    })
    .catch(error => {
      console.error('There was an error registering!', error);
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <label>
          Profile Image:
          <input type="file" name="profileImage" onChange={handleFileChange} />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

