'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('products', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'userId');
  },
};
