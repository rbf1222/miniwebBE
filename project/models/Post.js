// src/models/Post.js
import db from '../config/db.js'

// file주소를 URL로 변환
function mapFilePathToUrl(filePath) {
    if (!filePath) return null;

    // 파일명이 uploads 기준으로 잘린 경우
    const parts = filePath.split("uploads");
    if (parts.length < 2) return null;

    // \ → / 변환해서 URL 호환
    const relativePath = parts[1].replace(/\\/g, "/");

    return `/uploads${relativePath}`;
}

export async function createPost({ title, excelFilePath, authorId, visible_file }) {
    const [result] = await db.query(
        'INSERT INTO posts (title, excel_file, author_id, visible_file,created_at) VALUES (?, ?, ? ,?, NOW())',
        [title, excelFilePath, authorId, visible_file]
    );
    return { id: result.insertId, title, excelFilePath, visible_file, authorId };
}

export async function getAllPosts() {
    const [rows] = await db.query(
        `SELECT p.id, p.title, u.username , p.created_at
     FROM posts p
     JOIN users u
     WHERE p.author_id = u.id
     ORDER BY p.id DESC`
    );
    return rows;
}
 
export async function getPostById(id) {
    const [rows] = await db.query(
        `SELECT p.id, p.title, u.username , p.created_at , p.excel_file, p.visible_file
     FROM posts p
     JOIN users u
     ON p.author_id = u.id 
     WHERE p.id = ?`,
        [id]
    );
    if(!rows[0]) return null;
    
    const post = rows[0];
    post.excel_file = mapFilePathToUrl(post.excel_file);
    post.visible_file = mapFilePathToUrl(post.visible_file);
    return post;

}

export async function updatePost(id, { title }) {
    await db.query('UPDATE posts SET title = ? WHERE id = ?', [title, id]);
    return true;
}

export async function deletePost(id) {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return true;
}