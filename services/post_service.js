const prisma = require('../../prisma/client');
const { PostStatus } = require('../utils/enums');
const generateSlug = require('../utils/slugify');

async function publishPost(data) {
  return await prisma.$transaction(async (tx) => {
    // Check author exists
    const author = await tx.user.findUnique({ where: { id: data.authorId } });
    if (!author) throw { message: "Author not found", code: "AUTHOR_NOT_FOUND", status: 404 };

    //Generate slug from title and ensure uniqueness
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let count = 1;
    while (await tx.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Create post
    const post = await tx.post.create({
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: data.authorId
      }
    });

    // Handle tags
    if (data.tags && Array.isArray(data.tags)) {
      for (let tagName of data.tags) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });

        await tx.postTag.create({
          data: { postId: post.id, tagId: tag.id }
        });
      }
    }

    // Increment author's post count
    await tx.user.update({
      where: { id: data.authorId },
      data: { postCount: { increment: 1 } }
    });

    return post;
  });
}

// Get post with author, tags, and comments
async function getPost(slug) {
  const { getPostBySlug } = require('../repositories/post_repository');
  return await getPostBySlug(slug);
}

module.exports = { publishPost, getPost };