const { addCategory, fetchCategory, fetchCategories } = require('../services/category_service');

async function createCategoryHandler(req, res, next) {
  try {
    const category = await addCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function getCategoryHandler(req, res, next) {
  try {
    const category = await fetchCategory(parseInt(req.params.id));
    if (!category) return res.status(404).json({ error: "Category not found", code: "CATEGORY_NOT_FOUND" });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function getCategoriesHandler(req, res, next) {
  try {
    const categories = await fetchCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategoryHandler, getCategoryHandler, getCategoriesHandler };