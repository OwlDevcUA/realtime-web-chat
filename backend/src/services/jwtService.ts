import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

function generateEmailChangeToken(payload: { id: string; email: string; newEmail: string }) {
  return jwt.sign(payload, process.env.JWT_EMAIL_SECRET, { expiresIn: '1h' });
}

function validateAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as any;
  } catch (error) {
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

function validateEmailChangeToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_EMAIL_SECRET) as any;
  } catch {
    return null;
  }
}

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  generateEmailChangeToken,
  validateAccessToken,
  validateRefreshToken,
  validateEmailChangeToken,
};
