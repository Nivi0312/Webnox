import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Popover, Button, TextField } from '@mui/material';
import { AccountCircle, AddBox, ExitToApp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { UserContext } from '../App';
import PostForm from './PostForm';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [postFormOpen, setPostFormOpen] = useState(false);
    const [postContent, setPostContent] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = '';
        navigate('/signin');
    };

    const handlePostFormOpen = () => {
        setPostFormOpen(true);
        handleMenuClose();
    };

    const handlePostFormClose = () => {
        setPostFormOpen(false);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/posts', { content: postContent });
            setPostContent('');
            handlePostFormClose();
            window.location.reload(); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Social Media App
                </Typography>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handlePostFormOpen}>
                        Hi {user?.username}
                    </MenuItem>
                    <MenuItem onClick={()=>navigate('/myFeed')}>
                        My Post
                    </MenuItem>
                    <MenuItem onClick={handlePostFormOpen}>
                        <AddBox style={{ marginRight: '8px' }} />
                        Create Post
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ExitToApp style={{ marginRight: '8px' }} />
                        Logout
                    </MenuItem>
                </Menu>
                <Popover
                    open={postFormOpen}
                    onClose={handlePostFormClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                   <PostForm onPostAdded={handlePostFormClose}/>
                </Popover>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;