const express = require('express');
const router = express.Router();
const { registerUserHandler, getUserHandler } = require('../controllers/user_controller');
const validate = require('../middleware/validation_middleware');
const { z } = require('zod');

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional()
});

router.post('/', validate(userSchema), registerUserHandler);
router.get('/:id', getUserHandler);

module.exports = router;

