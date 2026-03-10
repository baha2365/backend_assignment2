const prisma = require('../../prisma/client');

async function createPost(data, tx) {
  return await tx.post.create({
    data
  });
}

async function getPostBySlug(slug) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: { include: { parent: true } },
      tags: { include: { tag: true } },
      comments: {
        where: { status: "APPROVED", deletedAt: null },
        include: {
          user: true,
          replies: { include: { user: true } }
        }
      }
    }
  });
}

module.exports = { createPost, getPostBySlug };