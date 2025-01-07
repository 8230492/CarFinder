const Car = require('./car');
const CarController = require('./carController');

const service = CarController(Car);

module.exports = service;