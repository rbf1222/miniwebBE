// src/controllers/adminController.js

import * as postService from '../services/postService.js';
import { parseExcelToJson } from '../services/excelService.js';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import sendSMS from "../services/smsService.js";
import { spawn } from 'child_process';
import sendBulkSMS from "../services/smsService.js";
import { getSmsReceivableUsers } from '../models/User.js';
import { send } from 'process';

function parseColumns(body) {
    try {
        if (typeof body.columns === "string") {
            const j = JSON.parse(body.columns)
            return Array.isArray(j) ? j : []
        }
    } catch (_) { }
    return []
}

export async function uploadPost(req, res, next) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        const f = req.files?.file?.[0] || req.file;     // ← fields/single 모두 대응
        if (!f) return res.status(400).json({ message: "file required" });

        const { title } = req.body;
        const columnsArr = parseColumns(req.body);      // ['검사길이','검사자ID'] 등
        const authorId = req.user.id;

        // 저장된 실제 경로
        const filePath = f.path;                         // ← 항상 f.path 사용
        const visibleDir = path.join(__dirname, '../uploads', 'visible');
        const outputImgPath = path.join(
            visibleDir,
            `${path.parse(f.filename).name}.png`
        );

        const users = await getSmsReceivableUsers();
        const recipients = users.map(u => u.phone.replace(/-/g, ''));
        const text = `[Auto Viz Dock] 새 게시글이 등록되었습니다. 지금 확인해보세요! \n바로가기 링크👉 http://localhost:5000/posts 📝`;

        await sendBulkSMS({
            recipients,
            text,
        });

        


        // Python 실행 (spawn으로 안전하게)
        await new Promise((resolve) => {
            // columns를 JSON 문자열로 전달(visualize.py가 json/csv 모두 수용)
            const columnsArg = JSON.stringify(columnsArr);

            const pyPath = path.join(__dirname, '../scripts', 'visualize.py');
            const pyBin = process.env.PYTHON_BIN || 'python'; // 윈도우면 'py'로 바꿔도 됨

            const child = spawn(pyBin, [pyPath, filePath, outputImgPath, columnsArg], {
                cwd: path.join(__dirname, '..'),
                stdio: ['ignore', 'pipe', 'pipe'],
                windowsHide: true,
            });

            let stderr = '';
            child.stderr.on('data', (d) => (stderr += d.toString()));
            child.on('close', (code) => {
                if (code !== 0) {
                    console.error('❌ Python 실행 오류:', stderr || `exit ${code}`);
                } else {
                    console.log('✅ 그래프 생성 완료:', outputImgPath);
                }
                resolve(); // 실패해도 업로드는 계속
            });
        });

        // DB 저장 (URL 경로 일관성: /uploads/... 형태)
        const excelRel = '/' + filePath.replace(/\\/g, '/');         // '/uploads/xxx.xlsx'
        const visibleRel = '/' + outputImgPath.replace(/\\/g, '/');  // '/uploads/visible/xxx.png'

        const post = await postService.uploadPost({
            title,
            filePath: excelRel,
            authorId,
            visible_file: visibleRel,
        });

        // (선택) 엑셀 간단 파싱
        try { parseExcelToJson(f.path); } catch (e) { }

        res.status(201).json({
            message: '게시물 업로드 성공',
            postId: post.id || post.insertId || null
        });
    } catch (err) {
        next(err);
    }
}

// export async function uploadPost(req, res, next) {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     try {
//         const f = req.files?.file?.[0] || req.file
//         if (!f) return res.status(400).json({ message: "file required" })

//         const { title } = req.body
//         const columns = parseColumns(req.body) // ★ 여기서 배열 확보
//         // const title = req.body.title;
//         // if (!req.file) return res.status(400).json({ error: true, message: 'File required' });
//         // const columns = req.body.columns; // "선종,용도판정" 같은 문자열
//         const filePath = path.join(__dirname, '../uploads', req.file.filename);

//         const authorId = req.user.id;

//         // <-------------------- PYTHON ------------------->
//         // ✅ Python 스크립트 실행 준비
//         const outputImgPath = path.join(
//             __dirname,
//             '../uploads',
//             'visible',
//             `${path.parse(req.file.filename).name}.png`
//         );

//         const pyPath = path.join(__dirname, '../scripts', 'visualize.py');

//         // 비동기로 Python 실행 (실패해도 게시글 업로드는 되도록)
//         exec(`python "${pyPath}" "${filePath}" "${outputImgPath}" "${columns}"`, (error, stdout, stderr) => {
//             if (error) {
//                 console.error('❌ Python 실행 오류:', stderr);
//             } else {
//                 console.log('✅ 그래프 생성 완료:', outputImgPath);
//             }
//         });
//         // <-------------------- PYTHON ------------------->

//         // ✅ DB 저장 (엑셀 경로 + 시각화 이미지 경로)
//         const post = await postService.uploadPost({
//             title,
//             filePath,
//             authorId,
//             visible_file: outputImgPath
//         });

//         // Optional: parse excel now and store or return brief stats
//         const parsed = parseExcelToJson(req.file.path);

//         res.status(201).json({ message: '게시물 업로드 성공', postId: post.id || post.insertId || null });
//     } catch (err) {
//         next(err);
//     }
// }

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