const { Product } = require('../models');
const dataJoiner = require('../../../shared/utils/dataJoiner');

class ProductService {
  async createProduct(productData) {
    return await Product.create(productData);
  }

  async getAllProducts(limit, offset, includeUsers = false) {
    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    let products = rows.map(product => product.toJSON());

    if (includeUsers) {
      products = await dataJoiner.joinData(products, {
        serviceName: 'userService',
        endpointName: 'getUsersByIds',
        foreignKey: 'userId',
        joinKey: 'id',
        as: 'user',
      });
    }

    return {
      products,
      pagination: { total: count, limit, offset, pages: Math.ceil(count / limit) },
    };
  }

  async getProductById(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return product.toJSON();
  }

  async updateProduct(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.update(updateData);
    return product.toJSON();
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.destroy();
  }

  async getProductsByIds(productIds) {
    if (!Array.isArray(productIds) || !productIds.length) throw new Error('Invalid product IDs');
    const products = await Product.findAll({ where: { id: productIds } });
    return products.map(product => product.toJSON());
  }

  async getProductsByUserIds(userIds) {
    if (!Array.isArray(userIds) || !userIds.length) throw new Error('Invalid user IDs');
    const products = await Product.findAll({
      where: { userId: userIds },
      order: [['createdAt', 'DESC']],
    });
    return products.map(product => product.toJSON());
  }
}

module.exports = new ProductService();
