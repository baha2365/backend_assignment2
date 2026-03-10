const express = require('express');
const router = express.Router();
const { createPostHandler, getPostHandler } = require('../controllers/post_controller');
const validate = require('../middleware/validation_middleware');
const { z } = require('zod');

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string(),
  authorId: z.number(),
  tags: z.array(z.string())
});

router.post('/', validate(postSchema), createPostHandler);
router.get('/:slug', getPostHandler);

module.exports = router;