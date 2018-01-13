'use strict'; // jshint ignore:line

let Boom = require( 'boom' );
let Moment = require( 'moment' );
let db = require( '../../database/models' );


// This function returns a single tax floor
exports.calculatePaySlip = ( request, reply ) =>
  // retrieve requested entry from database
  db.Employee.findById( request.params.id )
  // check if requested employee exists
  .then( employee =>
    !employee ?
      Promise.reject( Boom.notFound('id_not_found') ) :
      employee
  )
  // calculate the payslip information
  .then( employee => {

    return db.TaxRate.findAll({
      where: {
        bottom_floor: {
          $lte: employee.annual_salary
        },
        top_floor: {
          $gte: employee.annual_salary
        }
      }
    })
    // check if requested tax floor exists
    .then( tax_floor =>
      tax_floor.length !== 1 ?
        Promise.reject( Boom.notFound('consistency_failure_in_tax_rates_table') ) :
        tax_floor
    )
    // calculate the payslip information
    .then( tax_floor => {

      tax_floor = tax_floor[0].toJSON();

      let payslip = {};

      let period = Moment( request.payload.year.toString() + '-' + request.payload.month.toString(), "YYYY-MM" );
      payslip.pay_period = period.format( 'MMMM' ) + ' 01 to ' + period.format( 'MMMM' ) + ' ' + period.daysInMonth() + ', ' + period.format( 'YYYY' );

      payslip.full_name = employee.first_name + " " + employee.last_name;
      payslip.gross_income = Math.round( employee.annual_salary / 12 );

      let over_bottom_difference = employee.annual_salary - tax_floor.bottom_floor - 1;
      let tax_over_difference = over_bottom_difference * tax_floor.tax_per_unit_over_bottom_floor;
      payslip.income_tax = Math.round( (tax_floor.cumulative_tax_up_to_bottom_floor + tax_over_difference) / 12 );

      payslip.net_income = payslip.gross_income - payslip.income_tax;
      payslip.pension_contribution = Math.round( payslip.gross_income * employee.pension_rate / 100 );

      return payslip;
    });
  })
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );
