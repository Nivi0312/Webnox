import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });


export const createPost = async (req, res) => {
    const { userId, content } = req.body;
    console.log("hi", req.body)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!content) {
        return res.status(400).json({ error: 'Post content is required' });
    }

    try {
        console.log(imageUrl, userId, content)
        const [result] = await pool.execute(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [userId, content, imageUrl]
        );

        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    const { sortBy, userId } = req.query;
    let orderBy = 'posts.created_at DESC';
    console.log(userId)
    if (sortBy === 'likes') orderBy = 'like_count DESC';
    else if (sortBy === 'comments') orderBy = 'comment_count DESC';

    try {
        
        let postQuery = `
        SELECT 
            posts.*, 
            users.username, 
            IFNULL(like_data.like_count, 0) AS like_count,
            IFNULL(like_data.dislike_count, 0) AS dislike_count,
            IFNULL(comment_data.comment_count, 0) AS comment_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN (
            SELECT 
                post_id, 
                SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
            FROM likes
            GROUP BY post_id
        ) AS like_data ON posts.id = like_data.post_id
        LEFT JOIN (
            SELECT 
                post_id, COUNT(*) AS comment_count
            FROM comments
            GROUP BY post_id
        ) AS comment_data ON posts.id = comment_data.post_id
    `;

        const queryParams = [];

        if (userId) {
            postQuery += ` WHERE posts.user_id = ?`;
            queryParams.push(userId);
        }

        postQuery += ` GROUP BY posts.id, users.username ORDER BY ${orderBy}`;

        const [posts] = await pool.execute(postQuery, queryParams);

        const postIds = posts.map(post => post.id);
        let commentsMap = {};

        if (postIds.length > 0) {
            const commentQuery = `
                SELECT 
                    comments.*, 
                    users.username 
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE comments.post_id IN (${postIds.join(',')})
                ORDER BY comments.created_at ASC
            `;
            const [comments] = await pool.execute(commentQuery);

            commentsMap = comments.reduce((acc, comment) => {
                if (!acc[comment.post_id]) acc[comment.post_id] = [];
                acc[comment.post_id].push(comment);
                return acc;
            }, {});
        }
        const finalPosts = posts.map(post => ({
            ...post,
            comments: commentsMap[post.id] || []  
        }));

        res.json(finalPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [postId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    try {
        const [post] = await pool.execute('SELECT user_id FROM posts WHERE id = ?', [postId]);

        if (post.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post[0].user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await pool.execute('DELETE FROM posts WHERE id = ?', [postId]);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
