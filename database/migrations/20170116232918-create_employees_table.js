'use strict';


module.exports = {
  up: function( queryInterface, Sequelize ) {
    return queryInterface.createTable( 'employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      annual_salary: {
        type: Sequelize.FLOAT(9,3),
        allowNull: false
      },
      pension_rate: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hiring_date: {
        type: Sequelize.DATEONLY,
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
    return queryInterface.dropTable( 'employees' );
  }
};
