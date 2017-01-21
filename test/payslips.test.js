'use strict'; // jshint ignore:line

const Lab = require( 'lab' );
const lab = exports.lab = Lab.script();
const code = require( 'code' );

const db = require( '../database/models' );
const server = require( '../' ).select( 'api' );
const baseRoute = '/payslip';


lab.experiment( 'Payslip Endpoint', function() {

  var maximum_employees;
  var employee_one = {
    first_name: 'David',
    last_name: 'Rudd',
    annual_salary: 60050,
    pension_rate: 9,
    hiring_date: new Date(2016,11,10)
  };
  var employee_two = {
    first_name: 'Ryan',
    last_name: 'Chen',
    annual_salary: 120000,
    pension_rate: 10,
    hiring_date: new Date(2016,10,11)
  };
  var employee_three = {
    first_name: 'Joseph',
    last_name: 'Forrest',
    annual_salary: 22124,
    pension_rate: 15,
    hiring_date: new Date(2016,11,12)
  };
  var employee_four = {
    first_name: 'Beatrice',
    last_name: 'Jarvis',
    annual_salary: 406702,
    pension_rate: 50,
    hiring_date: new Date(2016,10,13)
  };
  var employee_five = {
    first_name: 'June',
    last_name: 'Symons',
    annual_salary: 14352,
    pension_rate: 0,
    hiring_date: new Date(2016,11,14)
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


  // Test scenario to calculate payslip with sample employee information
  lab.test( 'GET payslip - employee one', function( done ) {

    // create a test employee
    db.Employee.create( employee_one )
    .then( employee => {

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect full_name to be equal to 'David Rudd'
        code.expect( result.full_name ).to.be.equal( 'David Rudd' );
        // Expect gross_income = 60050 / 12 = 5004.16666666 (round down) = 5004
        code.expect( result.gross_income ).to.be.equal( 5004 );
        // Expect income_tax = (3572 + (60050 - 37000) x 0.325) / 12 = 921.9375 (round up) = 922
        code.expect( result.income_tax ).to.be.equal( 922 );
        // Expect net_income = 5004 - 922 = 4082
        code.expect( result.net_income ).to.be.equal( 4082 );
        // Expect pension_contribution = 5004 x 9% = 450.36 (round down) = 450
        code.expect( result.pension_contribution ).to.be.equal( 450 );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to calculate payslip with sample employee information
  lab.test( 'GET payslip - employee two', function( done ) {

    // create a test employee
    db.Employee.create( employee_two )
    .then( employee => {

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect full_name to be equal to 'Ryan Chen'
        code.expect( result.full_name ).to.be.equal( 'Ryan Chen' );
        // Expect gross_income = 120000 / 12 = 10000
        code.expect( result.gross_income ).to.be.equal( 10000 );
        // Expect income_tax = (17547 + (120000 - 80000) x 0.37) / 12 = 2695.58333333 (round up) = 2696
        code.expect( result.income_tax ).to.be.equal( 2696 );
        // Expect net_income = 10000 - 2696 = 7304
        code.expect( result.net_income ).to.be.equal( 7304 );
        // Expect pension_contribution = 10000 x 10% = 1000
        code.expect( result.pension_contribution ).to.be.equal( 1000 );



        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to calculate payslip with sample employee information
  lab.test( 'GET payslip - employee three', function( done ) {

    // create a test employee
    db.Employee.create( employee_three )
    .then( employee => {

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect full_name to be equal to 'Joseph Forrest'
        code.expect( result.full_name ).to.be.equal( 'Joseph Forrest' );
        // Expect gross_income = 22124 / 12 = 1843.6666667 (round up) = 1844
        code.expect( result.gross_income ).to.be.equal( 1844 );
        // Expect income_tax = (0 + (22124 - 18200) x 0.19) / 12 = 62.13 (round down) = 62
        code.expect( result.income_tax ).to.be.equal( 62 );
        // Expect net_income = 22124 - 62 = 1782
        code.expect( result.net_income ).to.be.equal( 1782 );
        // Expect pension_contribution = 22124 x 15% = 276.6 (round up) = 277
        code.expect( result.pension_contribution ).to.be.equal( 277 );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to calculate payslip with sample employee information
  lab.test( 'GET payslip - employee four', function( done ) {

    // create a test employee
    db.Employee.create( employee_four )
    .then( employee => {

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect full_name to be equal to 'Beatrice Jarvis'
        code.expect( result.full_name ).to.be.equal( 'Beatrice Jarvis' );
        // Expect gross_income = 406702 / 12 = 33891.83333333 (round up) = 33892
        code.expect( result.gross_income ).to.be.equal( 33892 );
        // Expect income_tax = (54547 + (406702 - 180000) x 0.45) / 12 = 13046.9083333333 (round up) = 13047
        code.expect( result.income_tax ).to.be.equal( 13047 );
        // Expect net_income = 33892 - 13047 = 20845
        code.expect( result.net_income ).to.be.equal( 20845 );
        // Expect pension_contribution = 33892 x 50% = 16946
        code.expect( result.pension_contribution ).to.be.equal( 16946 );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to calculate payslip with sample employee information
  lab.test( 'GET payslip - employee five', function( done ) {

    // create a test employee
    db.Employee.create( employee_five )
    .then( employee => {

      var options = {
        method: 'GET',
        url: baseRoute + '/' + employee.id
      }

      // server.inject allows a simulation of an http request
      server.inject( options, function( response ) {
        var result = response.result;

        // Expect http response status code to be 200 ("Ok")
        code.expect( response.statusCode ).to.be.equal( 200 );
        // Expect full_name to be equal to 'June Symons'
        code.expect( result.full_name ).to.be.equal( 'June Symons' );
        // Expect gross_income = 14352 / 12 = 1196
        code.expect( result.gross_income ).to.be.equal( 1196 );
        // Expect income_tax = (0 + (14352 - 0) x 0) / 12 = 0
        code.expect( result.income_tax ).to.be.equal( 0 );
        // Expect net_income = 1196 - 0 = 1196
        code.expect( result.net_income ).to.be.equal( 1196 );
        // Expect pension_contribution = 1196 x 0% = 0
        code.expect( result.pension_contribution ).to.be.equal( 0 );

        db.Employee.findById( employee.id )
        .then( employee => {
          // destroy the test employee
          employee.destroy();

          // done() callback is required to end the test.
          server.stop( done );
        });
      });
    });

  });


  // Test scenario to get an employee that does not exist in the database
  lab.test( 'GET payslip for non-existing employee', function( done ) {

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
  lab.test( 'GET payslip for database entry with negative ID', function( done ) {

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

});
