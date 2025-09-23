// src/services/postService.js

import * as Post from '../models/Post.js'
import * as Comment from '../models/Comment.js'

export async function uploadPost({ title, filePath, authorId ,visible_file}) {
    const post = await Post.createPost({ title, excelFilePath: filePath, authorId ,visible_file});
    return post;
}

export async function listPosts() {
    return await Post.getAllPosts(); 
}

export async function getPostDetail(postId) {
    const post = await Post.getPostById(postId);
    if (!post) {
        const err = new Error('Post not found');
        err.status = 404;
        throw err;
    }
    const comments = await Comment.getCommentsByPostId(postId);
    post.comments = comments;
    return post;
}

export async function updatePost(postId, data) {
    return await Post.updatePost(postId, data);
}

export async function deletePost(postId) {
    return await Post.deletePost(postId);
}