const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpClient = require('../../../shared/utils/httpClient');
const { setAuthCookies, clearAuthCookies } = require('../../../shared/utils/authUtils');

class AuthService {
  async register(email, password, firstName, lastName) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await httpClient.request(
      'userService',
      'createUser',
      {},
      {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      { internal: true }
    );

    const userResponse = user.toJSON ? user.toJSON() : user;
    delete userResponse.password;

    const accessToken = this.generateAccessToken({ userId: user.id });
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return { user: userResponse, accessToken, refreshToken };
  }

  async login(email, password) {
    const users = await httpClient.request('userService', 'getUserByEmail', { email }, null, {
      internal: true,
    });

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const userResponse = user.toJSON ? user.toJSON() : user;
    delete userResponse.password;

    const accessToken = this.generateAccessToken({ userId: user.id });
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return { user: userResponse, accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = this.generateAccessToken({ userId: decoded.userId });
    const newRefreshToken = this.generateRefreshToken({ userId: decoded.userId });

    return { accessToken, newRefreshToken };
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  setAuthCookies(res, accessToken, refreshToken) {
    setAuthCookies(res, accessToken, refreshToken);
  }

  clearAuthCookies(res) {
    clearAuthCookies(res);
  }
}

module.exports = new AuthService();
