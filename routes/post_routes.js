const express = require('express');
const router = express.Router();
const { createPostHandler, getPostHandler, addCommentHandler } = require('../controllers/post_controller');
const validate = require('../middleware/validation_middleware');
const { z } = require('zod');

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string(),
  authorId: z.number(),
  tags: z.array(z.string())
});



const commentSchema = z.object({
  postId: z.number(),
  userId: z.number(),
  content: z.string().min(1),
  parentId: z.number().optional() // optional for replies
});

router.post('/', validate(postSchema), createPostHandler);
router.get('/:slug', getPostHandler);

router.post('/comment', addCommentHandler);



router.post('/comment', validate(commentSchema), addCommentHandler);


const { deleteCommentHandler } = require('../controllers/post_controller');

router.delete('/comment/:id', deleteCommentHandler);

module.exports = router;