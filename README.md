### ATM Machine API

This is a Node.js API for an ATM machine that accepts withdrawal requests and returns the most optimized response based on the current inventory of bills and coins in the ATM.
The API supports multiple currencies and uses TypeScript for type checking and static analysis.

## Technologies

1. Node JS
2. Express
3. TypeScript
4. Jest

## Getting Started

To run the API, you will need to have Node.js and npm installed on your machine. You can then clone the repository and install the dependencies using npm:

$ git clone https://github.com/daniel-modilevsky/atm-machine-api.git
$ cd atm-machine-api
$ npm install
$ npm start

This will start the API server on port 3000 by default. You can change the port by setting the PORT environment variable.

## API Endpoints

The API exposes two main endpoints:

POST /atm/withdrawal
Accepts a withdrawal request with the following payload:

{
"currency": "USD",
"amount": 500
}

Returns a response with the most optimized breakdown of bills and coins for the requested amount:
{
"result": {
"bills": [{"100": 5}],
"coins": [{"0.25": 3}, {"0.1": 5}, {"0.01": 5}]
}
}

POST /admin/currency
Adds a new currency to the ATM inventory with the following payload:
{
"currency": "EUR",
"bills": [{"50": 10}, {"20": 20}],
"coins": [{"2": 50}, {"1": 100}, {"0.5": 100}]
}

Returns a success response if the currency was added successfully:

{
"status": "success",
"message": "Currency added successfully"
}

## Testing

The API includes unit tests for both the withdrawal and admin endpoints. You can run the tests using the following command:

npm test
This will run the tests using Jest and generate a coverage report in the coverage directory.

This will run the tests using Jest and generate a coverage report in the coverage directory.

## Aditor

This project is writed by Daniel Modilevsky.
Full stack software engnieer.
