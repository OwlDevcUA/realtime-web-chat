
import { ApiError } from 'src/exeptions/ApiError.js';
import { emailService } from '../services/emailService.js';
import { userService } from '../services/userService.js';
import bcrypt from 'bcrypt';
import { jwtService } from 'src/services/jwtService.js';
import { User } from 'src/modules/User.js';

async function nameChange(req, res, next) {
  const { newName } = req.body;
  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw ApiError.BadRequest('User does not exist', {});
  }

  const updaterUser = await userService.nameChange(user, newName);

  res.status(200).json(userService.normalize(updaterUser));
}

async function passwordChange(req, res, next) {
  const { password, oldPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw ApiError.BadRequest('User does not exist', {});
  }

  const isMatched = await bcrypt.compare(password, user.password);
  const accept = await bcrypt.compare(oldPassword, user.password);


  if (isMatched) {
    throw ApiError.BadRequest('You need to create new password', {});
  }

  if (!accept) {
    throw ApiError.BadRequest('Wrong password', {});
  }

  await userService.resetPassword(user, password);

  return res.send({ user: userService.normalize(user) });
}

async function requestEmailChange(req, res, next) {
  const { password, newEmail } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong', {});
  }

  const emailIsNotValid = emailService.validateEmail(newEmail);

  if (emailIsNotValid) {
    throw ApiError.BadRequest('Email is invalid', {});
  }


  
    if (process.env.SKIP_EMAIL === 'true') {
    user.email = newEmail;
    await user.save();

    return res.send({ user: userService.normalize(user) });
    }
  
  const token = jwtService.generateEmailChangeToken({
  id: user.id,
  email: user.email,
  newEmail,
  });

  await emailService.sendEmailChangeLink(newEmail, token);

  res.send({ message: 'OK' });
}

async function confirmEmailChange(req, res) {
  const data = jwtService.validateEmailChangeToken(req.params.emailChangeToken);

  if (!data) {
    throw ApiError.BadRequest('Link is invalid or expired', {});
  }

  const user = await User.findByPk(data.id);

  if (!user || user.email !== data.email) {
    throw ApiError.BadRequest('Link is no longer valid', {}); 
  }

  if (await userService.getByEmail(data.newEmail)) {
    throw ApiError.BadRequest('Email is already taken', {});
  }

  await userService.emailChange(user, data.newEmail)

  res.send({ user: userService.normalize(user)});
}

export const profileController = {
  nameChange,
  passwordChange,
  requestEmailChange,
  confirmEmailChange,
};
