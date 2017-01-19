'use strict'; // jshint ignore:line

const Lab = require( 'lab' );
const lab = exports.lab = Lab.script();
const code = require( 'code' );

const db = require( '../database/models' );
const server = require( '../' ).select( 'api' );
const baseRoute = '/employees';


lab.experiment( 'Employees Endpoint', function() {

  var maximum_employees;
  var sample_employee = {
    first_name: 'John',
    last_name: 'Doe',
    annual_salary: 60000,
    pension_rate: 10,
    hiring_date: new Date(2016,11,10)
  };
  var updated_employee = {
    first_name: 'Jane',
    last_name: 'Smith',
    annual_salary: 99999,
    pension_rate: 25,
    hiring_date: new Date(2016,10,11)
  };


  // Run before the first test
  lab.before( done => {

    db.Employee.count()
    .then( reply => {
      maximum_employees = reply;
      done();
    });

  });


  // Run before every single test
  lab.beforeEach( done => { done(); } );


  // Run after the every single test
  lab.afterEach( done => { done(); } );


  // Run after the last test
  lab.after( done => { done(); });


  // Test scenario to get all employees in the database
  lab.test( 'GET all employees', function( done ) {

    var options = {
      method: 'GET',
      url: baseRoute
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result;

      // Expect http response status code to be 200 ("Ok")
      code.expect( response.statusCode ).to.be.equal( 200 );

      // get all employees from database
      db.Employee.findAll()
      .then( employees => {
        // Expect result length to be equal to the database reply length
        code.expect( result.length ).to.be.equal( employees.length );

        for( var i=0; i<result.length; i++ ) {
          var employee = employees[i].toJSON();
          var res = result[i].toJSON();

          // Expect each employee in result to be equal to each employee in the database reply
          code.expect( res ).to.be.equal( employee );
        }

        // done() callback is required to end the test.
        server.stop( done );
      });
    });

  });


  // Test scenario to get a specific employee from the database
  lab.test( 'GET specific employee', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      employee = employee.toJSON();
      delete employee.created_at;
      delete employee.updated_at;

      sample_employee.id = employee.id;

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result.toJSON();

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect database reply to be equal to sample_employee
        code.expect( employee ).to.be.equal( sample_employee );
        // Expect result to be equal to database reply
        code.expect( result ).to.be.equal( employee );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete sample_employee.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to get an employee that does not exist in the database
  lab.test( 'GET non-existing employee', function( done ) {

    var options = {
      method: 'GET',
      url: baseRoute + '/' + maximum_employees*200+2000
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
  lab.test( 'GET negative ID employee', function( done ) {

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


  // Test scenario to create a new employee in the database
  lab.test( 'POST new employee', function( done ) {

    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
    }

    // server.inject allows a simulation of an http request
    server.inject( options, function( response ) {
      var result = response.result.toJSON();

      // Expect http response status code to be 200 ("Ok")
      code.expect( response.statusCode ).to.be.equal( 200 );

      // get created employee from database
      db.Employee.findById( result.id )
      .then( employee => {
        var emp = employee.toJSON();

        sample_employee.id = result.id;
        delete result.created_at;
        delete result.updated_at;

        // Expect database reply to be equal to result
        code.expect( emp ).to.be.equal( result );
        // Expect result to be equal to sample_employee
        code.expect( result ).to.be.equal( sample_employee );

        return employee;
      })
      .then( employee => {
        // destroy the employee created with POST
        employee.destroy();

        delete sample_employee.id;

        // done() callback is required to end the test.
        server.stop( done );
      });
    });

  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'POST new employee with forbidden keys - part 1 (forbidden: id)', function( done ) {

    sample_employee.id = 10;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    delete sample_employee.id;
  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'POST new employee with forbidden keys - part 2 (forbidden: created_at)', function( done ) {

    sample_employee.created_at = new Date();
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    delete sample_employee.created_at;
  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'POST new employee with forbidden keys - part 3 (forbidden: updated_at)', function( done ) {

    sample_employee.updated_at = new Date();
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    delete sample_employee.updated_at;
  });


  // Test scenario to create a new employee in the database with inexistent keys in the model
  lab.test( 'POST new employee with extra information (extra: non_existing_key)', function( done ) {

    sample_employee.non_existing_key = 'dummy value';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    delete sample_employee.non_existing_key;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 1 (first_name must be a string)', function( done ) {

    sample_employee.first_name = 10;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.first_name = 'Jane';
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 2 (last_name must be a string)', function( done ) {

    sample_employee.last_name = false;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.last_name = 'Smith';
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 3 (annual_salary must be a number)', function( done ) {

    sample_employee.annual_salary = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.annual_salary = 99999;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 4 (annual_salary must be larger than or equal to 1)', function( done ) {

    sample_employee.annual_salary = 0;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.annual_salary = 99999;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 5 (pension_rate must be a number)', function( done ) {

    sample_employee.pension_rate = 'not a number';
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.pension_rate = 25;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 6 (pension_rate must be less than or equal to 50)', function( done ) {

    sample_employee.pension_rate = 100;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.pension_rate = 25;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 7 (pension_rate must be larger than or equal to 0)', function( done ) {

    sample_employee.pension_rate = -100;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.pension_rate = 25;
  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'POST new employee with invalid data - part 8 (hiring_date must be a date)', function( done ) {

    sample_employee.hiring_date = false;
    var options = {
      method: 'POST',
      url: baseRoute,
      payload: sample_employee
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

    sample_employee.hiring_date = new Date(2016,12,12);
  });


  // Test scenario to update an existing employee in the database
  lab.test( 'PUT to existing employee', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result.toJSON();

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );

        // get updated employee from database
        db.Employee.findById( result.id )
        .then( employee => {
          var emp = employee.toJSON();

          updated_employee.id = result.id;
          delete result.created_at;
          delete result.updated_at;

          // Expect database reply to be equal to result
          code.expect( emp ).to.be.equal( result );
          // Expect result to be equal to updated_employee
          code.expect( result ).to.be.equal( updated_employee );

          return employee;
        })
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete updated_employee.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'PUT to existing employee with forbidden keys - part 1 (forbidden: id)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.id = 10;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete updated_employee.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'PUT to existing employee with forbidden keys - part 2 (forbidden: created_at)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.created_at = new Date();

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete updated_employee.id;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with forbidden keys
  lab.test( 'PUT to existing employee with forbidden keys - part 3 (forbidden: updated_at)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.updated_at = new Date();

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete updated_employee.updated_at;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with inexistent keys in the model
  lab.test( 'PUT to existing employee with extra information (extra: non_existing_key)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.non_existing_key = 'dummy value';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          delete updated_employee.non_existing_key;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 1 (first_name must be a string)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.first_name = 10;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.first_name = 'Jane';

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 2 (last_name must be a string)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.last_name = false;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.last_name = 'Smith';

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 3 (annual_salary must be a number)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.annual_salary = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.annual_salary = 99999;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 4 (annual_salary must be larger than or equal to 1)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.annual_salary = 0;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.annual_salary = 99999;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 5 (pension_rate must be a number)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.pension_rate = 'not a number';

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.pension_rate = 25;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 6 (pension_rate must be less than or equal to 50)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.pension_rate = 100;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.pension_rate = 25;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 7 (pension_rate must be larger than or equal to 0)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.pension_rate = -100;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.pension_rate = 25;

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to create a new employee in the database with invalid values
  lab.test( 'PUT to existing employee with invalid data - part 8 (hiring_date must be a date)', function( done ) {

    // create a test employee
    db.Employee.create( sample_employee )
    .then( employee => {
      updated_employee.hiring_date = false;

      var options = {
        method: 'PUT',
        url: baseRoute + '/' + employee.id,
        payload: updated_employee
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 400 ("Bad Request")
        code.expect( response.statusCode ).to.be.equal( 400 );
        code.expect( response.statusMessage ).to.be.equal( 'Bad Request' );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          updated_employee.hiring_date = new Date(2016,12,12);

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to delete a specific employee from the database
  lab.test( 'DELETE specific employee', function( done ) {

    db.Employee.create( sample_employee )
    .then( employee => {
      var options = {
        method: 'DELETE',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );

        // try to get deleted employee from database
        db.Employee.findById( employee.id )
        .then( employee => {
          // Expect database reply to be undefined
          code.expect( employee ).to.not.exist();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to delete an employee that does not exist in the database
  lab.test( 'DELETE non-existing employee', function( done ) {

    var options = {
      method: 'DELETE',
      url: baseRoute + '/' + maximum_employees*200+200000
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
  lab.test( 'DELETE negative ID employee', function( done ) {

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
