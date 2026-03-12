const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, findUserById } = require('../repositories/user_repository');

async function registerUser(data) {
  const existing = await findUserByEmail(data.email);

  if (existing)
    throw { message: "Email already in use", code: "EMAIL_EXISTS", status: 409 };

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUser({
    email: data.email,
    passwordHash: hashedPassword,
    role: data.role || 'author'
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function loginUser(data) {
  const user = await findUserByEmail(data.email);

  if (!user)
    throw { message: "User not found", code: "USER_NOT_FOUND", status: 404 };

  const match = await bcrypt.compare(data.password, user.passwordHash);

  if (!match)
    throw { message: "Invalid password", code: "INVALID_PASSWORD", status: 401 };

  return {
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

async function getUserProfile(userId) {
  const user = await findUserById(userId);

  if (!user)
    throw { message: "User not found", code: "USER_NOT_FOUND", status: 404 };

  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};