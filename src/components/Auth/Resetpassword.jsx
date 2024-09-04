// Resetpassword.js
import React, { useState } from 'react';
import './auth.css'; // Import the CSS file
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Resetpassword = () => {
  const [form, setForm] = useState({
    password: '',
  });

  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password } = form;

    Axios.post(`${import.meta.env.VITE_BACKENDURL}/auth/resetpassword/${id}/${token}`, { password })
      .then(() => {
        alert('Password reset successful! You can now log in with your new password.');
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
      
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Reset Password</h2>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default Resetpassword;
