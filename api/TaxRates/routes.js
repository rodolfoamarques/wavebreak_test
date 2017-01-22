'use strict'; // jshint ignore:line

var joi = require( 'joi' );
var controller = require( './controller' );

const endpoint = 'tax_rates';


module.exports = [
{
  method: 'POST',
  path: `/${endpoint}`,
  handler: controller.create,
  config: {
    description: 'Create a new floor in the tax rate table',
    notes: 'Insert a new row into the table',
    tags: ['api', 'tax_rates'],
    validate: {
      payload:
        joi.object({
          id: joi.any().forbidden(),
          bottom_floor: joi.number().min(0).precision(3).description('Base floor of tax calculation'),
          top_floor: joi.number().min(1).precision(3).description('Top floor of tax calculation'),
          tax_per_unit_over_bottom_floor: joi.number().min(0.001).precision(3).description('Base rate for tax calculation, per money unit above base floor'),
          cumulative_tax_up_to_bottom_floor: joi.number().min(0).precision(3).description('Cumulative tax to be added, based on previous top/bottom values and tax_per_unit_over_bottom_floor of each floor'),
          created_at: joi.any().forbidden(),
          updated_at: joi.any().forbidden(),
          deleted_at: joi.any().forbidden()
        }).meta({ className: 'TaxRateCreateModel' }).description('Create new Tax Rate Floor form')
    }
  }
}, {
  method: 'GET',
  path: `/${endpoint}`,
  handler: controller.readAll,
  config: {
    description: 'Retrieve complete tax rate table',
    notes: 'Get all entries in table',
    tags: ['api', 'tax_rates']
  }
}, {
  method: 'GET',
  path: `/${endpoint}/{id}`,
  handler: controller.readOne,
  config: {
    description: 'Retrieve a single tax floor',
    notes: 'Get a single entry in table',
    tags: ['api', 'tax_rates'],
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
    description: 'Update tax floor',
    notes: 'Update entry in table',
    tags: ['api', 'tax_rates'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Row\'s reference id')
      },
      payload:
        joi.object({
          id: joi.any().forbidden(),
          bottom_floor: joi.number().min(0).precision(3).description('Base floor of tax calculation'),
          top_floor: joi.number().min(1).precision(3).description('Top floor of tax calculation'),
          tax_per_unit_over_bottom_floor: joi.number().min(0.001).precision(3).description('Base rate for tax calculation, per money unit above base floor'),
          cumulative_tax_up_to_bottom_floor: joi.number().min(0).precision(3).description('Cumulative tax to be added, based on previous top/bottom values and tax_per_unit_over_bottom_floor of each floor'),
          created_at: joi.any().forbidden(),
          updated_at: joi.any().forbidden(),
          deleted_at: joi.any().forbidden()
        }).meta({ className: 'TaxRateUpdateModel' }).description('Update existing Tax Rate Floor form')
    }
  }
}, {
  method: 'DELETE',
  path: `/${endpoint}`,
  handler: controller.destroy,
  config: {
    description: 'Delete tax table (all entries)',
    notes: 'Delete all entries in table',
    tags: ['api', 'tax_rates']
  }
}, {
  method: 'DELETE',
  path: `/${endpoint}/{id}`,
  handler: controller.delete,
  config: {
    description: 'Delete tax floor (one entry)',
    notes: 'Delete a single entry in table',
    tags: ['api', 'tax_rates'],
    validate: {
      params: {
        id: joi.number().integer().min(1).required().description('Row\'s reference id')
      }
    }
  }
}];
