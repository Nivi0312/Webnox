import pool from '../config/db.js';

export const createLike = async ({ postId, userId, type }) => {
  const [result] = await pool.execute(
    'INSERT INTO likes (post_id, user_id, type) VALUES (?, ?, ?)',
    [postId, userId, type]
  );
  return result;
};

export const findLikesByPostId = async (postId) => {
  const [rows] = await pool.execute('SELECT * FROM likes WHERE post_id = ?', [postId]);
  return rows;
};

export const countLikes = async (postId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as likeCount FROM likes WHERE post_id = ? AND type = "like"',
    [postId]
  );
  return rows[0].likeCount;
};

export const countDislikes = async (postId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as dislikeCount FROM likes WHERE post_id = ? AND type = "dislike"',
    [postId]
  );
  return rows[0].dislikeCount;
};
