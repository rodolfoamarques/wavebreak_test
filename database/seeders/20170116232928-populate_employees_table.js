'use strict';

var newDate = new Date();


module.exports = {
  up: function( queryInterface, Sequelize ) {
    return queryInterface.bulkInsert( 'employees', [{
      first_name: "David",
      last_name: "Rudd",
      annual_salary: 60050,
      pension_rate: 9,
      hiring_date: newDate,
      created_at: newDate,
      updated_at: newDate
    }, {
      first_name: "Ryan",
      last_name: "Chen",
      annual_salary: 120000,
      pension_rate: 10,
      hiring_date: newDate,
      created_at: newDate,
      updated_at: newDate
    }, {
      first_name: "Joseph",
      last_name: "Forrest",
      annual_salary: 22124,
      pension_rate: 15,
      hiring_date: newDate,
      created_at: newDate,
      updated_at: newDate
    }, {
      first_name: "Beatrice",
      last_name: "Jarvis",
      annual_salary: 406702,
      pension_rate: 50,
      hiring_date: newDate,
      created_at: newDate,
      updated_at: newDate
    }, {
      first_name: "June",
      last_name: "Symons",
      annual_salary: 14352,
      pension_rate: 0,
      hiring_date: newDate,
      created_at: newDate,
      updated_at: newDate
    }], {} );
  },

  down: function( queryInterface, Sequelize ) {
    return queryInterface.bulkDelete( 'employees', null, {} );
  }
};
