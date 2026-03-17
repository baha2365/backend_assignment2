const { createCategory, getCategoryById, getAllCategories } = require('../repositories/category_repository');

async function addCategory(data) {
  return await createCategory(data);
}

async function fetchCategory(id) {
  return await getCategoryById(id);
}

async function fetchCategories() {
  return await getAllCategories();
}

module.exports = { addCategory, fetchCategory, fetchCategories };