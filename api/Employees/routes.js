'use strict'; // jshint ignore:line

var joi = require( 'joi' );
var controller = require( './controller' );

const endpoint = 'employees';


module.exports = [
{
  method: 'POST',
  path: `/${endpoint}`,
  handler: controller.create,
  config: {
    description: 'Create a new employee',
    notes: 'Insert a new row into the table',
    tags: ['api', 'employees'],
    validate: {
      payload:
        joi.object({
          id: joi.any().forbidden(),
          first_name: joi.string().required().description('Employee\'s first name'),
          last_name: joi.string().required().description('Employee\'s last name'),
          annual_salary: joi.number().min(1).required().description('Employee\'s annual salary'),
          pension_rate: joi.number().integer().min(0).max(50).required().description('Employee\'s pension rate'),
          hiring_date: joi.date().required().description('Employee\'s hiring date'),
          created_at: joi.any().forbidden(),
          updated_at: joi.any().forbidden(),
          deleted_at: joi.any().forbidden()
        }).meta({ className: 'EmployeeCreateModel' }).description('Create new Employee form')
    }
  }
}, {
  method: 'GET',
  path: `/${endpoint}`,
  handler: controller.readAll,
  config: {
    description: 'Retrieve the information of all employees',
    notes: 'Get all entries in table',
    tags: ['api', 'employees']
  }
}, {
  method: 'GET',
  path: `/${endpoint}/{id}`,
  handler: controller.readOne,
  config: {
    description: 'Retrieve the information of a specific employee',
    notes: 'Get a single entry in table',
    tags: ['api', 'employees'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Row\'s reference id')
      }
    }
  }
}, {
  method: 'PUT',
  path: `/${endpoint}/{id}`,
  handler: controller.update,
  config: {
    description: 'Update employee information',
    notes: 'Update entry in table',
    tags: ['api', 'employees'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Row\'s reference id')
      },
      payload:
        joi.object({
          id: joi.any().forbidden(),
          first_name: joi.string().description('Employee\'s first name'),
          last_name: joi.string().description('Employee\'s last name'),
          annual_salary: joi.number().min(1).description('Employee\'s annual salary'),
          pension_rate: joi.number().integer().min(0).max(50).description('Employee\'s pension rate'),
          hiring_date: joi.date().description('Employee\'s hiring date'),
          created_at: joi.any().forbidden(),
          updated_at: joi.any().forbidden(),
          deleted_at: joi.any().forbidden()
        }).meta({ className: 'EmployeeUpdateModel' }).description('Update existing Employee form')
    }
  }
}, {
  method: 'DELETE',
  path: `/${endpoint}/{id}`,
  handler: controller.delete,
  config: {
    description: 'Delete employee',
    notes: 'Delete a single entry in table',
    tags: ['api', 'employees'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Row\'s reference id')
      }
    }
  }
}];
