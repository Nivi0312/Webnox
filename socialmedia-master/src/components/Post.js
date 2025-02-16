import React, { useContext, useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { ThumbUp, ThumbDown, Comment } from '@mui/icons-material';
import api from '../api';
import PostImage from './PostImage';
import { UserContext } from '../App';

const Post = ({ post, fetchData }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const { user } = useContext(UserContext);
    const handleLike = async () => {
        try {
            const res = await api.post(`/likes/`, { type: 'like', postId: post.id, userId: user.id });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDislike = async () => {
        try {
            const res = await api.post(`/likes/`, { type: 'dislike', postId: post.id, userId: user.id });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async () => {
        try {
            await api.post(`/comments/`, { content: comment, postId: post.id, userId: user.id });
            setComment('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardHeader
                avatar={<Avatar>{post.username[0]}</Avatar>}
                title={post.username}
                subheader={new Date(post.created_at).toLocaleString()}
            />
            <PostImage imageUrl={`http://localhost:5000${post.image_url}`} />
            <CardContent>
                <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={handleLike}>
                    <ThumbUp /> {post.like_count}
                </IconButton>
                <IconButton onClick={handleDislike}>
                    <ThumbDown /> {post.dislikes}
                </IconButton>
            </CardActions>
            <CardContent>
                <Typography variant="h6">Comments</Typography>
                <List style={{maxHeight:"100px", overflowY:'auto'}}>
                    {post.comments.map((comment) => (
                        <ListItem key={comment.id}>
                            <ListItemText primary={comment.content} secondary={comment.username} />
                        </ListItem>
                    ))}
                </List>
                <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={handleComment}>Comment</Button>
            </CardContent>
        </Card>
    );
};

export default Post;