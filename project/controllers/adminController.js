// src/controllers/adminController.js

import * as postService from '../services/postService.js';
import { parseExcelToJson } from '../services/excelService.js';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

export async function uploadPost(req, res, next) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
        const title = req.body.title;
        if (!req.file) return res.status(400).json({ error: true, message: 'File required' });
        const columns = req.body.columns; // "선종,용도판정" 같은 문자열
        const filePath = path.join(__dirname, '../uploads', req.file.filename);

        const authorId = req.user.id;

        // <-------------------- PYTHON ------------------->
        // ✅ Python 스크립트 실행 준비
        const outputImgPath = path.join(
            __dirname,
            '../uploads',
            'visible',
            `${path.parse(req.file.filename).name}.png`
        );

        const pyPath = path.join(__dirname, '../scripts', 'visualize.py');

        // 비동기로 Python 실행 (실패해도 게시글 업로드는 되도록)
        exec(`python "${pyPath}" "${filePath}" "${outputImgPath}" "${columns}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Python 실행 오류:', stderr);
            } else {
                console.log('✅ 그래프 생성 완료:', outputImgPath);
            }
        });
        // <-------------------- PYTHON ------------------->

        // ✅ DB 저장 (엑셀 경로 + 시각화 이미지 경로)
        const post = await postService.uploadPost({
            title,
            filePath,
            authorId,
            visible_file: outputImgPath
        });

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