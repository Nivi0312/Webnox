import pool from '../config/db.js';

// Like or dislike a post
export const toggleLike = async (req, res) => {
  const { postId, type, userId } = req.body;

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ error: 'Invalid like type' });
  }

  try {
    // Check if user already liked/disliked the post
    const [existing] = await pool.execute(
      'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      // Update the like type
      await pool.execute(
        'UPDATE likes SET type = ? WHERE post_id = ? AND user_id = ?',
        [type, postId, userId]
      );
    } else {
      // Insert a new like
      await pool.execute(
        'INSERT INTO likes (post_id, user_id, type) VALUES (?, ?, ?)',
        [postId, userId, type]
      );
    }

    res.json({ message: 'Like status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get like/dislike count for a post
export const getLikeCounts = async (req, res) => {
  const { postId } = req.params;

  try {
    const [likes] = await pool.execute(
      'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ? AND type = "like"',
      [postId]
    );

    const [dislikes] = await pool.execute(
      'SELECT COUNT(*) AS dislikeCount FROM likes WHERE post_id = ? AND type = "dislike"',
      [postId]
    );

    res.json({ likeCount: likes[0].likeCount, dislikeCount: dislikes[0].dislikeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
