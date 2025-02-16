import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, List, Button, Menu, MenuItem, Grid } from '@mui/material';
import api, { setAuthToken } from '../api';
import Post from '../components/Post';
import Navbar from '../components/Navbar';
import { UserContext } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = ({ isHome }) => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/signin');
        else setUser(jwtDecode(token)?.user); setAuthToken(token);
    }, [])
    const fetchPosts = async () => {
        try {
            const res = await api.get(`/posts?sortBy=${sortBy}${!isHome ? `&userId=${user?.id}` : ''}`);

            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {

        user && fetchPosts();
    }, [sortBy, user,isHome]);

    return (
        <div>
            <Navbar />
            <Grid
                container
                justifyContent={'space-between'}
                alignItems={'center'}
                direction="row">
                <Typography variant="h4" gutterBottom>
                    {isHome ? 'Home' : 'My'} Feed
                </Typography>
                <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ mt: 2 }}>
                    Sort By
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => { setSortBy('likes'); setAnchorEl(null); }}>Likes</MenuItem>
                    <MenuItem onClick={() => { setSortBy('comments'); setAnchorEl(null); }}>Comments</MenuItem>
                    <MenuItem onClick={() => { setSortBy('time'); setAnchorEl(null); }}>Time</MenuItem>
                </Menu>
            </Grid>
            <Container>
                {posts.length > 0 ? <List>
                    {posts.map((post) => (
                        <Post fetchData={fetchPosts} key={post.id} post={post} />
                    ))}
                </List>
                    :
                    <Typography>
                        No Post available
                    </Typography>
                }
            </Container>
        </div>

    );
};

export default Home;
