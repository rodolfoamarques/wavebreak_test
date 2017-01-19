'use strict'; // jshint ignore:line

let Boom = require( 'boom' );
let db = require( '../../database/models' );


// This function will create a new employee and return its details.
exports.create = ( request, reply ) =>
  // insert a new row
  db.Employee.create( request.payload )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function returns the information of all employees in the database
exports.readAll = ( request, reply ) =>
  // retrieve all entries from database
  db.Employee.findAll()
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );


// This function returns the information of a specific employee
exports.readOne = ( request, reply ) =>
  // retrieve requested entry from database
  db.Employee.findById( request.params.id )
  // check if requested employee exists
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


// This function updates the details of an existing employee
exports.update = ( request, reply ) =>
  db.sequelize.transaction( t =>
    // retrieve requested row from database
    db.Employee.findById( request.params.id, { transaction: t } )
    // check if requested id exists
    .then( tax_rate =>
      !tax_rate ?
        Promise.reject( Boom.notFound('id_not_found') ) :
        tax_rate
    )
    // update the requested row
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


// This function soft-deletes all the information of a specific employee
exports.delete = ( request, reply ) =>
  // retrieve requested entry from database
  db.Employee.findById( request.params.id )
  // check if requested employee exists
  .then( tax_rate =>
    !tax_rate ?
      Promise.reject( Boom.notFound('id_not_found') ) :
      // destroy the requested employee (soft-delete)
      tax_rate.destroy()
  )
  // reply with the information
  .then( reply )
  // catch any error that may have been thrown
  .catch( err =>
    err.isBoom ?
      reply( err ) :
      reply( Boom.badImplementation(err) )
  );
