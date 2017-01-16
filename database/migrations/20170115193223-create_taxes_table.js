'use strict';

module.exports = {
  up: function( queryInterface, Sequelize ) {
    return queryInterface.createTable( 'tax_rates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
      },
      bottom_floor: {
        type: Sequelize.FLOAT(9,3),
        allowNull: false
      },
      top_floor: {
        type: Sequelize.FLOAT(9,3),
        allowNull: false
      },
      tax_per_unit_over_bottom_floor: {
        type: Sequelize.FLOAT(4,3),
        allowNull: false
      },
      cumulative_tax_up_to_bottom_floor: {
        type: Sequelize.FLOAT(9,3),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: Sequelize.DATE

    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable( 'tax_rates' );
  }
};
