const userService = require('../services/userService');
const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');

class UserController {
  createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    const response = ApiResponse.success(user, 'User created successfully', 201);
    res.status(response.statusCode).json(response);
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const result = await userService.getAllUsers(limit, offset);
    const response = ApiResponse.success(result, 'Users retrieved successfully');
    res.status(response.statusCode).json(response);
  });

  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    const response = ApiResponse.success(user, 'User retrieved successfully');
    res.status(response.statusCode).json(response);
  });

  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    const response = ApiResponse.success(user, 'User updated successfully');
    res.status(response.statusCode).json(response);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    const response = ApiResponse.success(null, 'User deleted successfully');
    res.status(response.statusCode).json(response);
  });
}

module.exports = new UserController();
