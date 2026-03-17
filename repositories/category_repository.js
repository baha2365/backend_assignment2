const prisma = require('../../prisma/client');
const generateSlug = require('../utils/slugify');

async function createCategory(data) {
  const slug = generateSlug(data.name);
  return await prisma.category.create({
    data: {
      name: data.name,
      slug,
      parentId: data.parentId || null,
    },
  });
}

async function getCategoryById(id) {
  return await prisma.category.findUnique({
    where: { id },
    include: { parent: true, children: true, posts: true },
  });
}

async function getAllCategories() {
  return await prisma.category.findMany({
    include: { parent: true, children: true },
  });
}

module.exports = { createCategory, getCategoryById, getAllCategories };