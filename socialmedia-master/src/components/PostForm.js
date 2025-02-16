import React, { useContext, useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
import api from '../api';
import { UserContext } from '../App';

const PostForm = ({ onPostAdded }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
    const {user} = useContext(UserContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', user.id);
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('post added successfully');
      onPostAdded();
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 3, p: 2, borderRadius: 2 }}>
      <Typography variant="h6">Create Post</Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        sx={{ mt: 2 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginTop: '10px' }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Post
      </Button>
    </Box>
  );
};

export default PostForm;
