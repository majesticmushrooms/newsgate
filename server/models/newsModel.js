var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var ratingSchema = new mongoose.Schema({
  score: Number,
  type: String,
  algorithm: String
});

var urlSchema = new mongoose.Schema({
  url: String,
  rating: ratingSchema
});

//bias rating is 0-4, 0 being far left, 2 is center, 4 is far right.
var biasSchema = new mongoose.Schema({
  url: String,
  rating: Number
})

module.exports = mongoose.model('News', urlSchema);