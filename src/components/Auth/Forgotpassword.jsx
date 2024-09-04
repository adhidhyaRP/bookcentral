
import React, { useState } from 'react';
import Axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post(`${import.meta.env.VITE_BACKENDURL}/auth/forgotpassword`, { email })
      .then((res) => {
        console.log(res.data); 
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const styles = {
    container: {
      maxWidth: '300px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
    button: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
    },
    title: {
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
