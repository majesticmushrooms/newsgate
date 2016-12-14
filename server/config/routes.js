var expanderController = require('../controllers/expanderController.js');
var newsController = require('../controllers/newsController.js');
var watsonController = require('../watson/watsonController.js');
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

  var apiArr = [expanderController.expandURL, newsController.isFakeNews, watsonController.getTitle,
                watsonController.getKeywords, twitterSearch.getTweetsOnTopic, googleTrends.getGoogleTrends];

  app.post('/api', apiArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  app.post('/api/ext', newsController.isFakeNews, function(req, res, next) {
    res.json(res.compoundContent);
  });

  app.post('/apitest', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  app.get('/twitter', twitterSearch.getTweetsOnTopic);


// -----------------
// Handle routes for watson's emotions and sentiment
// -----------------
  var popupArr = [watsonController.getEmotions, watsonController.getSentiment];
  
  app.get('/api/popup', popupArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

};
