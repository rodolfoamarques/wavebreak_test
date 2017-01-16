'use strict'; // jshint ignore:line

module.exports = function( sequelize, Sequelize ) {

  var TaxRate = sequelize.define( 'TaxRate', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      description: 'Table\'s row identifier'
    },
    bottom_floor: {
      type: Sequelize.FLOAT(9,3),
      allowNull: false,
      description: 'Base floor of tax calculation.'
    },
    top_floor: {
      type: Sequelize.FLOAT(9,3),
      allowNull: false,
      description: 'Top floor of tax calculation.'
    },
    tax_per_unit_over_bottom_floor: {
      type: Sequelize.FLOAT(4,3),
      allowNull: false,
      description: 'Base rate for tax calculation, per money unit above base floor.'
    },
    cumulative_tax_up_to_bottom_floor: {
      type: Sequelize.FLOAT(9,3),
      allowNull: false,
      description: 'Cumulative tax to be added, based on previous top/bottom values and tax_per_unit_over_bottom_floor of each floor.'
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
    tableName: 'tax_rates',
    defaultScope: { attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] } }
  });

  return TaxRate;
};
