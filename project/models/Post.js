// src/models/Post.js
import db from '../config/db.js'

export async function createPost({ title, excelFilePath, authorId }) {
    const [result] = await db.query(
        'INSERT INTO posts (title, excel_file, author_id, created_at) VALUES (?, ?, ?, NOW())',
        [title, excelFilePath, authorId]
    );
    return { id: result.insertId, title, excelFilePath, authorId };
}

export async function getAllPosts() {
    const [rows] = await db.query(
        `SELECT *
     FROM posts p
     ORDER BY p.id DESC`
    );
    return rows;
}

export async function getPostById(id) {
    console.log(id)
    const [rows] = await db.query(
        `SELECT id, title, author_id AS author, excel_file AS fileUrl, created_at
     FROM posts p
     WHERE p.id = ?`,
        [id]
    );
    return rows[0];
}

export async function updatePost(id, { title }) {
    await db.query('UPDATE posts SET title = ? WHERE id = ?', [title, id]);
    return true;
}

export async function deletePost(id) {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return true;
}