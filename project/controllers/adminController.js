// src/controllers/adminController.js

import * as postService from '../services/postService.js';
import { parseExcelToJson } from '../services/excelService.js';
import path from 'path';
import { exec } from 'child_process';

export async function uploadPost(req, res, next) {
    try {
        const title = req.body.title;
        if (!req.file) return res.status(400).json({ error: true, message: 'File required' });
        const filePath = `/uploads/${req.file.filename}`; // served statically

        const authorId = req.user.id;

// <-------------------- PYTHON ------------------->
        // ✅ Python 스크립트 실행 준비
        const outputImgPath = `/uploads/visible/${path.parse(req.file.filename).name}.png`
        
        // path.join(
        //     process.cwd(),
        //     'uploads',
        //     'visible',
        //     `${path.parse(req.file.filename).name}.png`
        // );

        const pyPath = '/scripts/visualize.py';
        //path.join(process.cwd(), 'scripts', 'visualize.py');

        // 비동기로 Python 실행 (실패해도 게시글 업로드는 되도록)
        exec(`python "${pyPath}" "${filePath}" "${outputImgPath}"`, (error, stdout, stderr) => {
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
            visibleFile: `${outputImgPath}`,
            authorId,
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