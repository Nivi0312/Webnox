import pool from '../config/db.js';
export const createPost = async ({ userId, content }) => {
    const [result] = await pool.execute(
        'INSERT INTO posts (user_id, content) VALUES (?, ?)',
        [userId, content]
    );
    return result;
};

export const findAllPosts = async () => {
    const [rows] = await pool.execute('SELECT * FROM posts');
    return rows;
};