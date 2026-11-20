import { ApiError } from 'src/exeptions/ApiError.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { emailService } from './emailService.js';
import { User } from 'src/modules/User.js';
import { Message } from 'src/modules/Message.js';
import { where } from 'sequelize';

function getByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

function normalize({ id, username, email }) {
  return { id, username, email };
}

async function register({ username, email, password }) {
  const userExists = await getByEmail(email);

  if (userExists) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is taken',
    });
  }

  const skipEmail = process.env.SKIP_EMAIL === 'true';

  const activationToken = skipEmail ? null : uuidv4();
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hash,
    activationToken,
  });

  if (activationToken) {
    await emailService.sendActivationLink(email, activationToken);
  }
}

async function forgotPassword(email) {
  const user = await getByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Wrong email',
    });
  }

  const resetToken = uuidv4();

  user.set({
    resetPasswordToken: resetToken,
  });
  await user.save();

  await emailService.sendResetLink(email, resetToken);
}

async function resetPassword(user, newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);

  user.set({
    password: hash,
    resetToken: null,
  });

  await user.save();

  return user;
}

async function nameChange(user, name) {
  user.set({
    username: name,
  });

  await user.save();

  return user;
}

async function emailChange(user, email) {
  user.set({
    email: email,
  });

  await user.save();
}

async function getUserById(userId) {
  return User.findByPk(userId);
}

export const userService = {
  register,
  normalize,
  getByEmail,
  resetPassword,
  forgotPassword,
  nameChange,
  emailChange,
  getUserById,
};
