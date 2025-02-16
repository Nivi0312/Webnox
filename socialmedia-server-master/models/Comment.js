import pool from '../config/db.js';

export const createComment = async ({ postId, userId, content }) => {
  const [result] = await pool.execute(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [postId, userId, content]
  );
  return result;
};

export const findCommentsByPostId = async (postId) => {
  const [rows] = await pool.execute('SELECT * FROM comments WHERE post_id = ?', [postId]);
  return rows;
};
