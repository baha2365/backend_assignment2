const express = require('express');
const router = express.Router();
const { createCategoryHandler, getCategoryHandler, getCategoriesHandler } = require('../controllers/category_controller');
const validate = require('../middleware/validation_middleware');
const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(2),
  parentId: z.number().optional()
});

router.post('/', validate(categorySchema), createCategoryHandler);
router.get('/:id', getCategoryHandler);
router.get('/', getCategoriesHandler);

module.exports = router;