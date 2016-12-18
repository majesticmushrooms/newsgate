var mongoose = require ('mongoose');

var popoverSchema = new mongoose.Schema({
  url: { type: String, unique: true},
  response: Object
});

var totalApiSchema = new mongoose.Schema({
  url: { type: String, unique: true},
  response: Object
});

module.exports.popover = mongoose.model('Popover', popoverSchema);

module.exports.api = mongoose.model('API', totalApiSchema);