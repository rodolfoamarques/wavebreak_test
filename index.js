'use strict'; /* jshint ignore:line */

let moment = require( 'moment' );

const Hapi = require( 'hapi' );
let server = new Hapi.Server();

let api = require('./api').init( server );

server.start( err => {
  if( err ) {
  	throw err;
  }

  console.log( ['initialize'], moment().calendar() );
  console.log( ['initialize'], 'Server running' );
  console.log( ['initialize'], 'API at: ' + server.select('api').info.uri );
});

module.exports = server;
