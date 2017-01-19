'use strict'; // jshint ignore:line

var joi = require( 'joi' );
var controller = require( './controller' );

const endpoint = 'payslip';


module.exports = [
{
  method: 'GET',
  path: `/${endpoint}/{id}`,
  handler: controller.calculatePaySlip,
  config: {
    description: 'Calculate the payslip of a specific employee',
    notes: 'Get a single entry in table and compute information',
    tags: ['api', 'payslip'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Employee\'s reference id')
      }
    }
  }
}];
