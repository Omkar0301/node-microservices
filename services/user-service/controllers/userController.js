const userService = require('../services/userService');
const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');

class UserController {
  createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    return res.status(201).json(ApiResponse.success(user, 'User created successfully'));
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0, products = 'false' } = req.query;
    const includeProducts = products.toLowerCase() === 'true';
    const result = await userService.getAllUsers(
      parseInt(limit),
      parseInt(offset),
      includeProducts
    );
    return res.json(ApiResponse.success(result, 'Users retrieved successfully'));
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return res.json(ApiResponse.success(user, 'User retrieved successfully'));
  });

  getUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.query;
    const user = await userService.getUserByEmail(email);
    return res.json(ApiResponse.success([user], 'User retrieved successfully'));
  });

  updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.json(ApiResponse.success(user, 'User updated successfully'));
  });

  deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    return res.json(ApiResponse.success(null, 'User deleted successfully'));
  });

  getUsersByIds = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const result = await userService.getUsersByIds(ids);
    return res.json(ApiResponse.success(result, 'Users retrieved successfully'));
  });
}

module.exports = new UserController();
