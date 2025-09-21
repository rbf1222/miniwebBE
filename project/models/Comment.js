// src/models/Comment.js
import db from '../config/db.js'

export async function createComment({ postId, userId, content }) {
    console.log(postId + userId)
    const [result] = await db.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [postId, userId, content]
    );
    return { id: result.insertId, postId, userId, content };
}

export async function updateComment(commentId, userId, content) {
    // ensure only owner can update (controller may check too)
    await db.query('UPDATE comments SET content = ? WHERE id = ? AND user_id = ?', [content, commentId, userId]);
    return true;
}

export async function deleteComment(commentId, userId) {
    await db.query('DELETE FROM comments WHERE id = ? AND user_id = ?', [commentId, userId]);
    return true;
}

export async function getCommentsByPostId(postId) {
    const [rows] = await db.query(
        `SELECT *
     FROM comments c
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
        [postId]
    );
    return rows;
}
