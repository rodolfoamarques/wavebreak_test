'use strict'; // jshint ignore:line

module.exports = function( sequelize, Sequelize ) {

  var Employee = sequelize.define( 'Employee', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      description: 'Table\'s row identifier'
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      description: 'Employee\'s first name'
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      description: 'Employee\'s last name'
    },
    annual_salary: {
      type: Sequelize.FLOAT(9,3),
      allowNull: false,
      description: 'Employee\'s annual salary'
    },
    pension_rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
      description: 'Employee\'s pension rate'
    },
    hiring_date: {
      type: Sequelize.DATE,
      allowNull: false,
      description: 'Employee\'s hiring date'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      description: 'Row created on'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      description: 'Row updated on'
    },
    deleted_at: {
      type: Sequelize.DATE,
      description: 'Row deleted on'
    }

  }, {
    tableName: 'employees',
    defaultScope: { attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] } }
  });

  return Employee;
};
