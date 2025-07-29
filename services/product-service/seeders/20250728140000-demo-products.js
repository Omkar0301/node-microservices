'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'products',
      [
        {
          id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
          name: 'Laptop Computer',
          description: 'High-performance laptop with 16GB RAM and 512GB SSD',
          price: 999.99,
          stock: 50,
          sku: 'LAP-001',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with precision tracking',
          price: 29.99,
          stock: 200,
          sku: 'MOU-002',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
          name: 'Mechanical Keyboard',
          description: 'RGB backlit mechanical keyboard with blue switches',
          price: 79.99,
          stock: 75,
          sku: 'KEY-003',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
          name: 'USB-C Cable',
          description: 'High-speed USB-C charging and data cable',
          price: 19.99,
          stock: 500,
          sku: 'USB-004',
          is_active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
