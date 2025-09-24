// src/controllers/postController.js
import * as postService from '../services/postService.js'
import fs from "fs";
import FormData from "form-data";
import DelayedStream from '../node_modules/delayed-stream/lib/delayed_stream.js';
import sendSMS from "../services/smsService.js";

export async function list(req, res, next) {
    try {
        const posts = await postService.listPosts();
        res.json(posts);
    } catch (err) {
        next(err);
    }
}



export async function detail(req, res, next) {
    try {
        const id = req.params.id;
        const post = await postService.getPostDetail(id);
        res.json(post);
    } catch (err) {
        next(err);
    }

    // try {
    //     const id = req.params.id;
    //     const post = await postService.getPostDetail(id);
    //     const form = new FormData();

    //     // 텍스트 데이터 추가
    //     Object.entries(post).forEach(([key, value]) => {
    //         if (key !== 'fileUrl' && key !== 'visibleUrl' && key !== 'comments') {
    //             form.append(key, value ?? '');
    //         }
    //     });

    //     // 댓글 데이터는 JSON 문자열로 변환하여 추가
    //     form.append('comments', JSON.stringify(post.comments || []));

    //     // 파일 추가: 파일 경로에 파일이 존재하는지 확인 후 DelayedStream으로 감싸서 추가
    //     if (post.fileUrl && fs.existsSync(post.fileUrl)) {
    //         // 파일을 스트림으로 읽고, DelayedStream으로 감싸서 버퍼링
    //         const fileStream = fs.createReadStream(post.fileUrl);
    //         const delayedFileStream = DelayedStream.create(fileStream);
    //         form.append('excel_file', delayedFileStream);
    //     }

    //     if (post.visibleUrl && fs.existsSync(post.visibleUrl)) {
    //         const visibleStream = fs.createReadStream(post.visibleUrl);
    //         const delayedVisibleStream = DelayedStream.create(visibleStream);
    //         form.append('visible_file', delayedVisibleStream);
    //     }
        
    //     // 응답 헤더 설정
    //     res.set(form.getHeaders());
        
    //     // FormData를 응답 스트림에 파이프하여 전송 시작
    //     form.pipe(res);

    // } catch (err) {
    //     next(err);
    // }
}

export async function createAndSendSMS(req, res, next) {
  const { title, content, userPhone } = req.body;

  if (!title || !content || !userPhone) {
    return res.status(400).json({
      error: "title, content, userPhone 모두 필요합니다.",
    });
  }

  try {
    const smsText = `[공지] ${title}\n${content}`;

    await sendSMS({
      to: userPhone,
      text: smsText,
    });

    res.status(200).json({
      success: true,
      message: "게시글 등록 및 문자 발송 완료",
    });
  } catch (err) {
    console.error("문자 전송 실패:", err);
    res.status(500).json({
      error: "문자 전송 실패",
      detail: err.message,
    });
  }
}