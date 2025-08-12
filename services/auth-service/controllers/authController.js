const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const authService = require('../services/authService');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const { user, accessToken, refreshToken } = await authService.register(
      email,
      password,
      firstName,
      lastName
    );

    if (req.headers['x-auth-type'] === 'cookie') {
      authService.setAuthCookies(res, accessToken, refreshToken);
      return res.status(201).json(ApiResponse.success({ user }, 'User registered successfully'));
    }

    return res
      .status(201)
      .json(
        ApiResponse.success({ user, accessToken, refreshToken }, 'User registered successfully')
      );
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    if (req.headers['x-auth-type'] === 'cookie') {
      authService.setAuthCookies(res, accessToken, refreshToken);
      return res.json(ApiResponse.success({ user }, 'Login successful'));
    }

    return res.json(ApiResponse.success({ user, accessToken, refreshToken }, 'Login successful'));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);

    if (req.headers['x-auth-type'] === 'cookie') {
      authService.setAuthCookies(res, accessToken, newRefreshToken);
      return res.json(ApiResponse.success({}, 'Token refreshed successfully'));
    }

    return res.json(
      ApiResponse.success(
        { accessToken, refreshToken: newRefreshToken },
        'Token refreshed successfully'
      )
    );
  });

  emailReset = asyncHandler(async (req, res) => {
    const { userId, newEmail } = req.body;
    const updatedUser = await authService.emailReset(userId, newEmail);
    return res.json(ApiResponse.success(updatedUser, 'Email updated successfully'));
  });

  passwordReset = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    await authService.passwordReset(email, newPassword);
    return res.json(ApiResponse.success(null, 'Password reset successfully'));
  });

  logout = asyncHandler(async (req, res) => {
    if (req.headers['x-auth-type'] === 'cookie') {
      authService.clearAuthCookies(res);
    }
    return res.json(ApiResponse.success({}, 'Logged out successfully'));
  });
}

module.exports = new AuthController();
