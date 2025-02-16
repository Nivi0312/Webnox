import React, { useContext, useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../App';

const Signin = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(jwtDecode(res.data.token)?.user);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="Signin-container" maxWidth="sm">
      <Typography className="Signin-title" variant="h4" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <Button className="Signin-button" type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </form>
      <Typography className="Signin-footer" variant="body1" style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Typography>
    </Container>
  );
};

export default Signin;
