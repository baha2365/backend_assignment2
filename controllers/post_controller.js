const { publishPost, getPost } = require('../services/post_service');

async function createPostHandler(req, res, next) {
  try {
    const post = await publishPost(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

async function getPostHandler(req, res, next) {
  try {
    const post = await getPost(req.params.slug);
    if (!post) return res.status(404).json({ error: "Post not found", code: "POST_NOT_FOUND" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPostHandler, getPostHandler };