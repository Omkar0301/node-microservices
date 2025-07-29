'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-123456789012',
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          password: hashedPassword,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'b2c3d4e5-f6a7-8901-bcde-234567890123',
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          password: hashedPassword,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
          email: 'bob.wilson@example.com',
          first_name: 'Bob',
          last_name: 'Wilson',
          password: hashedPassword,
          is_active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
