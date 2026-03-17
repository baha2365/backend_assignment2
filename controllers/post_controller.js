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




async function addCommentHandler(req, res, next) {
  try {
    const { addComment } = require('../services/post_service');
    const comment = await addComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}



const { createComment } = require('../services/post_service');

async function addCommentHandler(req, res, next) {
  try {
    const comment = await createComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}




async function deleteCommentHandler(req, res, next) {
  try {
    const { deleteComment } = require('../services/post_service');
    const commentId = parseInt(req.params.id);
    const comment = await deleteComment(commentId);
    res.json({ message: "Comment soft-deleted", comment });
  } catch (err) {
    next(err);
  }
}


module.exports = { createPostHandler, getPostHandler, addCommentHandler , deleteCommentHandler};