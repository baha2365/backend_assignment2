const { registerUser, getUserProfile } = require('../services/user_service');

async function registerUserHandler(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function getUserHandler(req, res, next) {
  try {
    const user = await getUserProfile(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUserHandler, getUserHandler };