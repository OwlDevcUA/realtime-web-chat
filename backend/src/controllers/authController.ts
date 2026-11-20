import { ApiError } from "src/exeptions/ApiError";
import { User } from "src/modules/User";
import { emailService } from "src/services/emailService";
import { userService } from "src/services/userService";
import bcrypt from 'bcrypt';
import { jwtService } from "src/services/jwtService";
import { tokenService } from "src/services/tokenService";

function validatePassword(value) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
}

function validateName(value) {
  if (!value) {
    return 'Name is required';
  }
}

async function register(req, res, next) {
  const { username, email, password } = req.body;

  const errors = {
    name: validateName(username),
    email: emailService.validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password || errors.name) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  await userService.register({ username, email, password });

  res.send({ message: 'OK' });
}

async function activate(req, res, next) {
  const { activationToken } = req.params;

  const user = await User.findOne({
    where: { activationToken },
  });

  if (!user) {
    res.sendStatus(404);

    return;
  }

  user.set('activationToken', null);
  await user.save();

  await sendAuthentication(res, user);
}

async function forgotPassword(req, res, next) {
  const { email } = req.body;

  await userService.forgotPassword(email);

  res.send({ message: 'OK' });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await userService.getByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist', {});
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong', {});
  }

  if (user.activationToken) {
    throw ApiError.Unauthorized();
  }

  await sendAuthentication(res, user);
}

async function logout(req, res, next) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  res.clearCookie('refreshToken');

  if (userData) {
    await tokenService.remove((userData as any).id);
  }

  res.sendStatus(204);
}

async function refresh(req, res, next) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token = await tokenService.getByToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const user = await User.findByPk((userData as any).id);

  await sendAuthentication(res, user);
}

async function resetPassword(req, res, next) {
  const { email, password, confirmPassword } = req.body;
  const user = await userService.getByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist', {});
  }

  if (password !== confirmPassword) {
    throw ApiError.BadRequest('Passwords should be equal', {});
  }

  await userService.resetPassword(user, password);
}

async function sendAuthentication(res, user, redirect = false) {
  const userData = userService.normalize(user);
  const accessToken = jwtService.generateAccessToken(userData);
  const refreshToken = jwtService.generateRefreshToken(userData);

  await tokenService.save(user.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  if (redirect) {
    return res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?accessToken=${accessToken}`,
    );
  }

  res.send({
    user: userData,
    accessToken,
  });
}

export const authController = {
  register,
  activate,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  sendAuthentication,
};