'use strict'; /* jshint ignore:line */

let api;
var fs = require( 'fs' );
var path = require( 'path' );
let db = require( '../database/models' );
let basename = path.basename( module.filename );


exports.init = ( server ) => {

  if( api ) {
    return api;
  }

  server.connection({
    labels: ['api'],
    host: '127.0.0.1',
    port: 3666,
    routes: { cors: true }
  });

  api = server.select( 'api' );

  api.register(
    [
      require( 'inert' ),
      require( 'vision' ),
      {
        register: require('hapi-swaggered'),
        options: {
          schemes: ['http'],
          auth: false
        }
      },
      {
        register: require('hapi-swaggered-ui'),
        options: {
          path: '/docs',
          auth: false,
          authorization: {
            field: 'authorization',
            scope: 'header',
            defaultValue: 'demoKey',
            placeholder: 'Enter your apiKey here'
          },
          swaggerOptions: {
            validatorUrl: null
          }
        }
      }
    ], err => {

      if( err ) {
        throw err;
      }

      api.route({
        path: '/',
        method: 'GET',
        handler: ( request, reply ) => reply.redirect( 'docs' )
      });
    }
  );

  // Look through the routes in all the subdirectories
  // of the API and create a new route for each one
  fs.readdirSync( __dirname )
  .filter( file => file !== basename )
  .forEach( file => {
    let routes = require( path.join(__dirname, file, 'routes') );

    api.route( routes );
  });

  return api;
};
