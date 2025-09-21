// src/controllers/postController.js
import * as postService from '../services/postService.js'

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
}
