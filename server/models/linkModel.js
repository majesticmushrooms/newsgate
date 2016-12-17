var mongoose = require('mongoose');

var keywordSchema = new mongoose.Schema({
  relevance: String, 
  text: String
});

var savedLinkSchema = new mongoose.Schema({
  name: String,
  fbID: Number,
  url: {type: String, unique: true},
  title: String,
  keywords: [keywordSchema]
});

module.exports = mongoose.model('SavedLink', savedLinkSchema);
