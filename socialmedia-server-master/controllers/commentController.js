import pool from '../config/db.js';

// Add a comment to a post
export const addComment = async (req, res) => {
  const { postId, content, userId } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    );

    res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a post
export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const [rows] = await pool.execute(`
      SELECT comments.*, users.username 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE post_id = ?
      ORDER BY comments.created_at DESC
    `, [postId]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
