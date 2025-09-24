// src/controllers/userController.js
import * as Comment from '../models/Comment.js'

export async function createComment(req, res, next) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: true, message: 'Content required' });
        const comment = await Comment.createComment({ postId, userId, content });
        res.status(201).json({ message: '댓글 작성 성공', commentId: comment.id });
    } catch (err) {
        next(err); 
    }
}

export async function updateComment(req, res, next) {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;
        await Comment.updateComment(commentId, userId, content);
        res.json({ message: '댓글 수정 성공' });
    } catch (err) {
        next(err);
    }
}

export async function deleteComment(req, res, next) {
    try {
        const commentId = req.params.id;
        //const userId = req.user.id;
        await Comment.deleteComment(commentId);
        res.json({ message: '댓글 삭제 성공' });
    } catch (err) {
        next(err);
    }
}