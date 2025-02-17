import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/signin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className="root">
      <Container className="Signup-container" maxWidth="sm">
        <Typography className="Signup-title" variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form className="Signup-form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="Signup-button" type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Typography className="Signup-footer" variant="body1">
          Already have an account? <Link to="/signin" className="Signup-link">Sign In</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Signup;
