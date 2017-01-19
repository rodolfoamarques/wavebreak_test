'use strict';

var newDate = new Date();


module.exports = {
  up: function( queryInterface, Sequelize ) {
    return queryInterface.bulkInsert( 'tax_rates', [{
      bottom_floor: 0,
      top_floor: 18200,
      tax_per_unit_over_bottom_floor: 0,
      cumulative_tax_up_to_bottom_floor: 0,
      created_at: newDate,
      updated_at: newDate
    }, {
      bottom_floor: 18201,
      top_floor: 37000,
      tax_per_unit_over_bottom_floor: 0.190,
      cumulative_tax_up_to_bottom_floor: 0,
      created_at: newDate,
      updated_at: newDate
    }, {
      bottom_floor: 37001,
      top_floor: 80000,
      tax_per_unit_over_bottom_floor: 0.325,
      cumulative_tax_up_to_bottom_floor: 3572,
      created_at: newDate,
      updated_at: newDate
    }, {
      bottom_floor: 80001,
      top_floor: 180000,
      tax_per_unit_over_bottom_floor: 0.370,
      cumulative_tax_up_to_bottom_floor: 17547,
      created_at: newDate,
      updated_at: newDate
    }, {
      bottom_floor: 180001,
      top_floor: 999999.999,
      tax_per_unit_over_bottom_floor: 0.450,
      cumulative_tax_up_to_bottom_floor: 54547,
      created_at: newDate,
      updated_at: newDate
    }], {} );
  },

  down: function( queryInterface, Sequelize ) {
    return queryInterface.bulkDelete( 'tax_rates', null, {} );
  }
};
