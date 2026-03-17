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


async function addComment(data) {
  const prisma = require('../../prisma/client');
  return await prisma.comment.create({
    data: {
      postId: data.postId,
      userId: data.userId,
      content: data.content,
      status: data.status || 'PENDING',
      parentId: data.parentId || null
    }
  });
}




const { CommentStatus } = require('../utils/enums');

async function createComment(data) {
  const prisma = require('../../prisma/client');

  // Optional: check if post exists
  const post = await prisma.post.findUnique({ where: { id: data.postId } });
  if (!post) throw { message: "Post not found", code: "POST_NOT_FOUND", status: 404 };

  // Optional: check if parent comment exists (for replies)
  if (data.parentId) {
    const parentComment = await prisma.comment.findUnique({ where: { id: data.parentId } });
    if (!parentComment) throw { message: "Parent comment not found", code: "PARENT_COMMENT_NOT_FOUND", status: 404 };
  }

  return await prisma.comment.create({
    data: {
      postId: data.postId,
      userId: data.userId,
      content: data.content,
      status: CommentStatus.PENDING, // default pending
      parentId: data.parentId || null
    }
  });
}

async function deleteComment(commentId) {
  const prisma = require('../../prisma/client');
  return await prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: new Date() }
  });
}


// Get post with author, tags, and comments
async function getPost(slug) {
  const { getPostBySlug } = require('../repositories/post_repository');
  return await getPostBySlug(slug);
}

module.exports = { publishPost, getPost, createComment ,deleteComment, addComment};