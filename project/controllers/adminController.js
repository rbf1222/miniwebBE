// src/controllers/adminController.js

import * as postService from '../services/postService.js';
import { parseExcelToJson } from '../services/excelService.js';

export async function uploadPost(req, res, next) {
    try {
        const title = req.body.title;
        if (!req.file) return res.status(400).json({ error: true, message: 'File required' });
        const filePath = `/uploads/${req.file.filename}`; // served statically
        const authorId = req.user.id;

        // Save in DB
        const post = await postService.uploadPost({ title, filePath, authorId });

        // Optional: parse excel now and store or return brief stats
        // const parsed = parseExcelToJson(req.file.path);

        res.status(201).json({ message: '게시물 업로드 성공', postId: post.id || post.insertId || null });
    } catch (err) {
        next(err);
    }
}

export async function updatePost(req, res, next) {
    try {
        const id = req.params.id;
        const { title } = req.body;
        await postService.updatePost(id, { title });
        res.json({ message: '게시물 수정 성공' });
    } catch (err) {
        next(err);
    }
}

export async function deletePost(req, res, next) {
    try {
        const id = req.params.id;
        await postService.deletePost(id);
        res.json({ message: '게시물 삭제 성공' });
    } catch (err) {
        next(err);
    }
}