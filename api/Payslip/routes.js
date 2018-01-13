'use strict'; // jshint ignore:line

var joi = require( 'joi' );
var controller = require( './controller' );

const endpoint = 'payslip';


module.exports = [
{
  path: `/${endpoint}/{id}`,
  method: 'POST',
  handler: controller.calculatePaySlip,
  config: {
    description: 'Calculate the payslip of a specific employee',
    notes: 'Use employee and tax rate information to output employee\'s payslip',
    tags: ['api', 'payslip'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Employee\'s reference id'),
      },
      payload:
        joi.object({
          id: joi.any().forbidden(),
          month: joi.number().integer().min(1).max(12).required().description('Caculate payslip for this month'),
          year: joi.number().integer().min(1950).max(2100).required().description('Calculate payslip for this year')
        }).meta({ className: 'PayslipCalculationModel' }).description('Calculate employee\'s payslip form')
    }
  }
}];
