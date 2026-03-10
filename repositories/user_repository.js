const prisma = require('../../prisma/client');

async function createUser(data) {
  return await prisma.user.create({
    data
  });
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

async function incrementPostCount(userId) {
  return await prisma.user.update({
    where: { id: userId },
    data: { postCount: { increment: 1 } }
  });
}

module.exports = { createUser, findUserByEmail, findUserById, incrementPostCount };