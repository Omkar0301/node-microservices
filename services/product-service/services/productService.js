const { Product } = require('../models');

class ProductService {
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(limit = 10, offset = 0) {
    try {
      const { count, rows } = await Product.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
      });

      return {
        products: rows,
        pagination: {
          total: count,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw new Error('Product not found');
      }

      await product.update(updateData);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw new Error('Product not found');
      }

      await product.destroy();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
