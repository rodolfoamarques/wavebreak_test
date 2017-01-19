'use strict'; // jshint ignore:line

const Code = require( 'code' );
const Lab = require( 'lab' );
const lab = exports.lab = Lab.script();

const db = require( '../database/models' );

const server = require( '../' ).select( 'api' );
const baseRoute = '/employees';


lab.experiment( "Employees Endpoint", function() {

  lab.test( 'GET all employees', function( done ) {
    var options = {
      method: "GET",
      url: baseRoute
    };

    console.log(server.table());
    server.table();

    server.inject( options, function( response ) {
      var result = response.result;
      console.log( result );
      console.log( options );

      done();
    });
  });

});
