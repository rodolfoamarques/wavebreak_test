'use strict'; // jshint ignore:line

const Lab = require( 'lab' );
const lab = exports.lab = Lab.script();
const code = require( 'code' );

const db = require( '../database/models' );
const server = require( '../' ).select( 'api' );
const baseRoute = '/tax_rates';


lab.experiment( 'TaxRates Endpoint', function() {

  var total_floors;
  var sample_tax_rate_floor = {
    bottom_floor: 150000,
    top_floor: 200000,
    tax_per_unit_over_bottom_floor: 0.123,
    cumulative_tax_up_to_bottom_floor: 18236
  };
  var updated_tax_rate_floor = {
    bottom_floor: 150001,
    top_floor: 200500,
    tax_per_unit_over_bottom_floor: 0.526,
    cumulative_tax_up_to_bottom_floor: 91256
  };


  // Run before the first test
  lab.before( done => {

    db.TaxRate.count()
    .then( reply => {
      total_floors = reply;
      done();
    });

  });


  // Run before every single test
  lab.beforeEach( done => { done(); } );


  // Run after the every single test
  lab.afterEach( done => { done(); } );


  // Run after the last test
  lab.after( done => { done(); });


  // Test scenario to get all tax floors in the database
  lab.test( 'GET all tax floors', function( done ) {

    var options = {
      method: 'GET',
      url: baseRoute
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 200 ("Ok")
      code.expect( response.statusCode ).to.be.equal( 200 );

      // get all tax floors from database ordered by bottom_floor (lowest first)
      db.TaxRate.findAll({ order: [['bottom_floor', 'ASC']] })
      .then( tax_table => {
        // Expect result length to be equal to the database reply length
        code.expect( result.length ).to.be.equal( tax_table.length );

        for( var i=0; i<result.length; i++ ) {
          var tax_floor = tax_table[i].toJSON();
          var res = result[i].toJSON();

          // Expect each tax floor in result to be equal to each tax floor in the database reply
          code.expect( res ).to.be.equal( tax_floor );
        }

        // done() callback is required to end the test.
        server.stop( done );
      });
    });

  });


  // Test scenario to get a specific tax floor from the database
  lab.test( 'GET specific tax floor', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      tax_floor = tax_floor.toJSON();
      delete tax_floor.created_at;
      delete tax_floor.updated_at;

      sample_tax_rate_floor.id = tax_floor.id;

      var options = {
        method: 'GET',
        url: baseRoute + '/' + tax_floor.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result.toJSON();

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect database reply to be equal to sample_tax_rate_floor
        code.expect( tax_floor ).to.be.equal( sample_tax_rate_floor );
        // Expect result to be equal to database reply
        code.expect( result ).to.be.equal( tax_floor );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete sample_tax_rate_floor.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to get an entry with an ID that does not exist in the database
  lab.test( 'GET non-existing tax floor', function( done ) {

    var options = {
      method: 'GET',
      url: baseRoute + '/' + total_floors*200+2000
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 404 ("Not Found")
      code.expect( response.statusCode ).to.be.equal( 404 );
      code.expect( response.statusMessage ).to.be.equal( 'Not Found' );

      // done() callback is required to end the test.
      server.stop( done );
    });

  });


  // Test scenario to get an entry with a negative id from the database
  lab.test( 'GET negative ID tax floor', function( done ) {

    var options = {
      method: 'GET',
      url: baseRoute + '/-1'
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

  });


  // Test scenario to create a new tax_floor in the database
  lab.test( 'POST new tax_floor', function( done ) {

    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result.toJSON();

      // Expect http response status code to be 200 ("Ok")
      code.expect( response.statusCode ).to.be.equal( 200 );

      // get created tax floor from database
      db.TaxRate.findById( result.id )
      .then( tax_floor => {
        var floor = tax_floor.toJSON();

        sample_tax_rate_floor.id = result.id;
        delete result.created_at;
        delete result.updated_at;

        // Expect database reply to be equal to result
        code.expect( floor ).to.be.equal( result );
        // Expect result to be equal to sample_tax_rate_floor
        code.expect( result ).to.be.equal( sample_tax_rate_floor );

        return tax_floor;
      })
      .then( tax_floor => {
        // destroy the tax floor created with POST
        tax_floor.destroy();

        delete sample_tax_rate_floor.id;

        // done() callback is required to end the test.
        server.stop( done );
      });
    });

  });


  // Test scenario to create a new tax floor in the database with forbidden keys
  lab.test( 'POST new tax floor with forbidden keys - part 1 (forbidden: id)', function( done ) {

    sample_tax_rate_floor.id = 10;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    delete sample_tax_rate_floor.id;
  });


  // Test scenario to create a new tax floor in the database with forbidden keys
  lab.test( 'POST new tax floor with forbidden keys - part 2 (forbidden: created_at)', function( done ) {

    sample_tax_rate_floor.created_at = new Date();
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    delete sample_tax_rate_floor.created_at;
  });


  // Test scenario to create a new tax floor in the database with forbidden keys
  lab.test( 'POST new tax floor with forbidden keys - part 3 (forbidden: updated_at)', function( done ) {

    sample_tax_rate_floor.updated_at = new Date();
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    delete sample_tax_rate_floor.updated_at;
  });


  // Test scenario to create a new tax floor in the database with inexistent keys in the model
  lab.test( 'POST new tax floor with extra information (extra: non_existing_key)', function( done ) {

    sample_tax_rate_floor.non_existing_key = 'dummy value';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    delete sample_tax_rate_floor.non_existing_key;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 1 (bottom_floor must be a number)', function( done ) {

    sample_tax_rate_floor.bottom_floor = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.bottom_floor = 150000;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 2 (bottom_floor must be larger than or equal to 0)', function( done ) {

    sample_tax_rate_floor.bottom_floor = -124;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.bottom_floor = 150000;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 3 (top_floor must be a number)', function( done ) {

    sample_tax_rate_floor.top_floor = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.top_floor = 200000;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 4 (top_floor must be larger than or equal to 1)', function( done ) {

    sample_tax_rate_floor.top_floor = -124;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.top_floor = 200000;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 5 (tax_per_unit_over_bottom_floor must be a number)', function( done ) {

    sample_tax_rate_floor.tax_per_unit_over_bottom_floor = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.123;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 6 (tax_per_unit_over_bottom_floor must be larger than or equal to 0.001)', function( done ) {

    sample_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.0001;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.123;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 7 (cumulative_tax_up_to_bottom_floor must be a number)', function( done ) {

    sample_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 18236;
  });


  // Test scenario to create a new tax floor in the database with invalid values
  lab.test( 'POST new tax floor with invalid data - part 8 (cumulative_tax_up_to_bottom_floor must be larger than or equal to 0)', function( done ) {

    sample_tax_rate_floor.cumulative_tax_up_to_bottom_floor = -124;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_tax_rate_floor
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

    sample_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 18236;
  });


  // Test scenario to update an existing tax floor in the database
  lab.test( 'PUT to existing tax floor', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result.toJSON();

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );

        // get updated tax floor from database
        db.TaxRate.findById( result.id )
        .then( floor => {
          var f = floor.toJSON();

          updated_tax_rate_floor.id = result.id;
          delete result.created_at;
          delete result.updated_at;

          // Expect database reply to be equal to result
          code.expect( f ).to.be.equal( result );
          // Expect result to be equal to updated_tax_rate_floor
          code.expect( result ).to.be.equal( updated_tax_rate_floor );

          return floor;
        })
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete updated_tax_rate_floor.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with forbidden keys
  lab.test( 'PUT to existing tax floor with forbidden keys - part 1 (forbidden: id)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.id = 10;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete updated_tax_rate_floor.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with forbidden keys
  lab.test( 'PUT to existing tax floor with forbidden keys - part 2 (forbidden: created_at)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.created_at = new Date();

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete updated_tax_rate_floor.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with forbidden keys
  lab.test( 'PUT to existing tax floor with forbidden keys - part 3 (forbidden: updated_at)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.updated_at = new Date();

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete updated_tax_rate_floor.updated_at;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with forbidden keys
  lab.test( 'PUT to existing tax floor with extra information (extra: non_existing_key)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.non_existing_key = 'dummy value';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          delete updated_tax_rate_floor.non_existing_key;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 1 (bottom_floor must be a number)', function( done ) {

    // create a test tax_floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.bottom_floor = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.bottom_floor = 150001;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 2 (bottom_floor must be larger than or equal to 0)', function( done ) {

    // create a test tax_floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.bottom_floor = -124;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.bottom_floor = 150001;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 3 (top_floor must be a number)', function( done ) {

    // create a test tax_floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.top_floor = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.top_floor = 200500;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 4 (top_floor must be larger than or equal to 1)', function( done ) {

    // create a test tax_floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.top_floor = 0;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.top_floor = 200500;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 5 (tax_per_unit_over_bottom_floor must be a number)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.tax_per_unit_over_bottom_floor = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.526;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 6 (tax_per_unit_over_bottom_floor must be larger than or equal to 0.001)', function( done ) {

    // create a test tax_floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.0001;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.tax_per_unit_over_bottom_floor = 0.526;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 7 (cumulative_tax_up_to_bottom_floor must be a number)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 91256;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to update an existing tax floor in the database with invalid values
  lab.test( 'PUT to existing tax floor with invalid data - part 8 (cumulative_tax_up_to_bottom_floor must be larger than or equal to 0)', function( done ) {

    // create a test tax floor
    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      updated_tax_rate_floor.cumulative_tax_up_to_bottom_floor = -124;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + tax_floor.id,
        payload: updated_tax_rate_floor
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // destroy the test tax floor
          floor.destroy();

          updated_tax_rate_floor.cumulative_tax_up_to_bottom_floor = 91256;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to delete a specific tax floor from the database
  lab.test( 'DELETE specific tax floor', function( done ) {

    db.TaxRate.create( sample_tax_rate_floor )
    .then( tax_floor => {
      var options = {
        method: 'DELETE',
        url: baseRoute + '/' + tax_floor.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );

        // try to get deleted tax floor from database
        db.TaxRate.findById( tax_floor.id )
        .then( floor => {
          // Expect database reply to be undefined
          code.expect( floor ).to.not.exist();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to delete an tax floor that does not exist in the database
  lab.test( 'DELETE non-existing tax floor', function( done ) {

    var options = {
      method: 'DELETE',
      url: baseRoute + '/' + total_floors*200+200000
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 404 ("Not Found")
      code.expect( response.statusCode ).to.be.equal( 404 );
      code.expect( response.statusMessage ).to.be.equal( 'Not Found' );

      // done() callback is required to end the test.
      server.stop( done );
    });

  });


  // Test scenario to delete an entry with a negative id from the database
  lab.test( 'DELETE negative ID tax floor', function( done ) {

    var options = {
      method: 'DELETE',
      url: baseRoute + '/-1'
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 400 ("Bad Request")
      code.expect( response.statusCode ).to.be.equal( 400 );
      code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

      // done() callback is required to end the test.
      server.stop( done );
    });

  });

});
