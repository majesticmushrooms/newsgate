var expanderController = require('../controllers/expanderController.js');
var newsController = require('../controllers/newsController.js');
var watsonController = require('../watson/watsonController.js');
var biasController = require('../bias/biasController.js');
var linkController = require('../controllers/linkController.js');
const googleTrends = require('../trends/googleTrends');
const twitterSearch = require('../trends/twitterTrends');

module.exports = function (app, express) {

/*  This middlware builds the response object starting with the URL expansion
  and tacking on the successive API calls by calling the controllers' next()
  function.
  You'll likely want to improve upon this by creating different endpoints with
  different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe
  just for talking to Watson and so forth.
*/

  // -----------------
  // Main API route
  // -----------------

  var apiArr = [watsonController.getTitle, newsController.isFakeNews, watsonController.getKeywords, twitterSearch.getTweetsOnTopic, googleTrends.getGoogleTrends];

  app.post('/api', apiArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Popover route
  // -----------------

  var popupArr = [watsonController.getTitle, newsController.isFakeNews, watsonController.getEmotions, watsonController.getSentiment, biasController.getData];

  app.post('/api/popover', popupArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Links route
  // -----------------

  var linkArr = [watsonController.getTitle, watsonController.getKeywords, linkController.saveToDB];

  app.post('/api/links', linkArr, function (req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Single controller routes
  // -----------------

  app.post('/api/test', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);

  app.get('/api/twitter', twitterSearch.getTweetsOnTopic);

  app.get('/api/bias', biasController.getData);

};
