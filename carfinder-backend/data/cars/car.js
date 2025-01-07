let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CarSchema = new Schema ({
  name: { type: String, required: true },
  image_url: { type: String, required: true }
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
