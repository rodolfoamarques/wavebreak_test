# Welcome to the Wavebreak Media Coding Exercise!

Please complete the exercise below using the language of your choice (Node.JS, JavaScript, Ruby, Java) and send us your solution. BTW we love JavaScript at WaveBreak Media but feel free to choose the language  you love Take as much time as you need. We perform these tests to get a feel for how you approach problems, how you think, and how you design your code. Thank you and have fun.



## Problem: Australian employee monthly payslip

When I input the employee's details: first name, last name, annual salary(positive integer) and pension rate(0% - 50% inclusive), payment start date, the program should generate payslip information with name, pay period, gross income, income tax, net income and pension.

The calculation details will be the following:
* pay period = per calendar month
* gross income = annual salary / 12 months
* income tax = based on the tax table provide below
* net income = gross income - income tax
* pension contribution = gross income x pension rate

Notes: All calculation results should be rounded to the whole dollars. If >= 50 cents round up to the next dollar increment, otherwise round down. The following rates for 2012-13 apply from 1 July 2012 in Australia Taxable income Tax on this income
* 0 - $18,200 Nil
* $18,201 - $37,000 19c for each $1 over $18,200
* $37,001 - $80,000 $3,572 plus 32.5c for each $1 over $37,000
* $80,001 - $180,000 $17,547 plus 37c for each $1 over $80,000
* $180,001 and over $54,547 plus 45c for each $1 over $180,000

The tax table is from ATO: [Individual Income Tax Rates](https://www.ato.gov.au/Rates/Individual-income-tax-rates/)

Example Data
Employee annual salary is 60,050, pension rate is 9%, how much will this employee be paid for the month of March ?
* pay period = Month of March (01 March to 31 March)
* gross income = 60,050 / 12 = 5,004.16666667 (round down) = 5,004
* income tax = (3,572 + (60,050 - 37,000) x 0.325) / 12 = 921.9375 (round up) = 922
* net income = 5,004 - 922 = 4,082
* pension contribution = 5,004 x 9% = 450.36 (round down) = 450

Here is the csv input and output format we provide. (But feel free to use any format you want)

  Input (first name, last name, annual salary, pension rate (%), payment start date):
  > David,Rudd,60050,9%,01 March – 31 March
  >
  > Ryan,Chen,120000,10%,01 March – 31 March

  Output (name, pay period, gross income, income tax, net income, super):
  > David Rudd,01 March – 31 March,5004,922,4082,450
  >
  > Ryan Chen,01 March – 31 March,10000,2696,7304,1000

As part of your solution:
* List any assumptions that you have made in order to solve this problem.
* Provide instruction on how to run the application
* Provide a test harness to validate your solution.

Good luck!



## Versions

```
$ node -v
v6.9.1

$ npm -v
4.1.1

$ nvm -v
Running version 1.1.1.
```
Python 3.4.4 (download)[https://www.python.org/downloads/release/python-344/] <- MySQL 5.7 requirement
MySQL 5.7 (download)[https://dev.mysql.com/downloads/windows/installer/5.7.html]

Developed on Windows OS



## Installation

#### Prerequisites

  1. This repo assumes you have a node.js environment ready, preferably with the previously described versions of npm and node.

  2. Some necessary global npm packages:
    ```
    $ npm install -g sequelize sequelize-cli mysql
    ```

  3. You should also download and install a mysql environment and setup the following:
    > create a database named: wavebreak_dev
    > setup a user named: root
    > set the password: root_pass
    > grant access to database "wavebreak_dev" to user "root"
    >
    > If you already have your environment setup and want another username/password, simply update the file "config.json" inside folder "config"

#### Getting started

1. To get started, clone the repo, enter it and then install the dependencies:
  ```
  $ npm install
  ```

2. Next, migrate the database (this step assumes you already created an empty database called "wavebreak_dev"):
  ```
  $ sequelize db:migrate
  $ sequelize db:seed:all
  ```

3. Finally, run the test suite to verify that everything is working correctly:
  ```
  $ npm test
  ```

4. If the test suite passes, you'll be ready to run the app in a local server:
  ```
  $ npm start
  ```

5. Visualize the api documentation on: [http://localhost:3666/](http://localhost:3666/docs). This will allow you to easily see what routes are available, what information each route requires and to easily test and interact with the api. If you wish, feel free to access each route separately by their address in the browser (for example [http://localhost:3666/payslip](http://localhost:3666/payslip)) but remember this is an 'api only' project. No front-end whatsoever was developed.




## Assumptions

* Individual Income Tax Rates table
  > In the description, this table is provided as a static information. Despite that, on real scenarios this is a table that is usually adjusted every year. For this reason I thought it best to create a table in the database where this information is stored and retrieved instead of simply hardcode it in the logic. A controller and routes to create/read/update/delete were also added to allow editing the values in the table. It should be noted that this is a simple implementation. The focus of the task is the calculation of the payslip and not the consistency of the information on this table. Although some validation exists (requiring all information, assuring that only numbers are provided, verification that reference id's exist), it concerns the assurance of the calculation of the payslip. Further validation should be added in a production environment, for example to ensure that each floor's ceiling is just one monetary unit less than the next floor's bottom, automate the calculation of the cumulative taxes between each floor to minimize human error or even add start/end dates for the period where that floor is in effect. On a last note, in a production environment, this information would probably come from an automated integration with a government Web API or similar, rendering the controller useless in most of it's routes.

* Employee module
  > As with the ITR table, a simplistic module to create/read/update/delete employees was added. From the exercise alone, this would seem an overkill to solve the problem. Still, on a production environment, it does not make sense to calculate the payslip of an employee without an employee registry. It is a simple module with only the required information to calculate the payslip, and is mainly aimed to assist the creation of new employees to develop new test scenarios for the payslip calculation function. On a production environment this entity would most likely have a unique column identifying each employee and several other personal information of the employee.

* Payslip calculation
  > Since the exercise is not explicit, I also assumed that the payslip is calculated per employee and not for multiple employees at the same time. This could be simply modified either by calling the function multiple times, or by modifying the function to receive an array of ids as argument and return an array of payslips.

* FrontEnd
  > Since I use swagger for documentation and human testing of each API route, and since the exercise is omissive regarding FrontEnd development, I saved some effort and did not develop any kind of FrontEnd interface. Swagger usually provides a simple yet good enough interface to interact with the API routes, but if FontEnd is also a requirement, please do give a description of what be acceptable and allow me a couple more days to complete it.
