'use strict'; // jshint ignore:line

let Boom = require( 'boom' );
let db = require( '../../database/models' );


// This function will create a new tax floor
exports.create = ( request, reply ) =>
  // insert a new entry in the database
  db.TaxRate.create( request.payload )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function returns the complete income tax rate table
exports.readAll = ( request, reply ) =>
  // retrieve all entries from database
  db.TaxRate.findAll({ order: [['bottom_floor', 'ASC']] })
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function returns a single tax floor
exports.readOne = ( request, reply ) =>
  // attempt to retrieve requested entry from database
  db.TaxRate.findById( request.params.id )
  // check if requested entry exists
  .then( tax_rate =>
    !tax_rate ?
      Promise.reject( Boom.notFound('id_not_found') ) :
      tax_rate
  )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function updates the details of an existing tax floor
exports.update = ( request, reply ) =>
  db.sequelize.transaction( t =>
    // attempt to retrieve requested entry from database
    db.TaxRate.findById( request.params.id, { transaction: t } )
    // check if requested entry exists
    .then( tax_rate =>
      !tax_rate ?
        Promise.reject( Boom.notFound('id_not_found') ) :
        tax_rate
    )
    // update the requested entry
    .then( tax_rate => tax_rate.update(request.payload, { transaction: t }) )
  )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function soft-deletes all the information from the tax table
exports.destroy = ( request, reply ) =>
  // delete all rows from table in database
  db.TaxRate.destroy({ where: {} })
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function soft-deletes a single tax floor row from the table
exports.delete = ( request, reply ) =>
  db.sequelize.transaction( t =>
    // attempt to retrieve requested entry from database
    db.TaxRate.findById( request.params.id )
    // check if requested entry exists
    .then( tax_rate =>
      !tax_rate ?
        Promise.reject( Boom.notFound('id_not_found') ) :
        tax_rate
    )
    // destroy the requested entry (soft-delete)
    .then( tax_rate => tax_rate.destroy({ transaction: t }) )
  )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );
