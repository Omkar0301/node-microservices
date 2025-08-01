const { User } = require('../models');
const dataJoiner = require('../../../shared/utils/dataJoiner');

class UserService {
  async createUser(userData) {
    const user = await User.create(userData);
    const userResponse = user.toJSON();
    delete userResponse.password;
    return userResponse;
  }

  async getAllUsers(limit, offset, includeProducts = false) {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    let users = rows.map(user => user.toJSON());

    if (includeProducts) {
      users = await dataJoiner.joinData(users, {
        serviceName: 'productService',
        endpointName: 'getProductsByUserIds',
        foreignKey: 'id',
        joinKey: 'userId',
        as: 'products',
      });
    }

    return {
      users,
      pagination: { total: count, limit, offset, pages: Math.ceil(count / limit) },
    };
  }

  async getUserById(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');
    return user.toJSON();
  }

  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(updateData);
    const userResponse = user.toJSON();
    delete userResponse.password;
    return userResponse;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
  }

  async getUsersByIds(userIds) {
    if (!Array.isArray(userIds) || !userIds.length) throw new Error('Invalid user IDs');
    const users = await User.findAll({
      where: { id: userIds },
      attributes: { exclude: ['password'] },
    });
    return users.map(user => user.toJSON());
  }
}

module.exports = new UserService();
