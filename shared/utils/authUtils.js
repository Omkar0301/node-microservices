const jwt = require('jsonwebtoken');
const ApiResponse = require('./responseFormatter');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.development') });

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: 'strict',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict',
  });
};

const clearAuthCookies = res => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  let type;

  // Extract token and type
  if (authHeader) {
    const [prefix, value] = authHeader.split(' ');
    if (prefix === 'Bearer' || prefix === 'Internal') {
      type = prefix;
      token = value;
    }
  }

  // If no token in header, fallback to accessToken cookie (user only)
  if (!token && req.cookies?.accessToken) {
    type = 'Bearer';
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json(ApiResponse.error('Unauthorized', 401));
  }

  try {
    if (type === 'Bearer') {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId };
    } else if (type === 'Internal') {
      const decoded = jwt.verify(token, process.env.INTERNAL_SECRET);
      req.internal = { service: decoded.service }; // optional fields like role, etc.
    } else {
      return res.status(401).json(ApiResponse.error('Invalid auth type', 401));
    }

    return next();
  } catch (error) {
    return res.status(401).json(ApiResponse.error('Invalid or expired token', 401));
  }
};

module.exports = { setAuthCookies, clearAuthCookies, authenticateJWT };
