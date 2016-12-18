var expanderController = require('../controllers/expanderController.js');
var newsController = require('../controllers/newsController.js');
var watsonController = require('../watson/watsonController.js');
var biasController = require('../bias/biasController.js');
var linkController = require('../controllers/linkController.js');
var watsonTestController = require ('../watson/testDataController.js');
const googleTrends = require('../trends/googleTrends');
const twitterSearch = require('../trends/twitterTrends');
var passport = require('passport')

module.exports = function (app, express) {

/*  This middlware builds the response object starting with the URL expansion
  and tacking on the successive API calls by calling the controllers' next()
  function.
  You'll likely want to improve upon this by creating different endpoints with
  different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe
  just for talking to Watson and so forth.
*/

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('autenticated!') 
      console.log(req.user);
      return next(); 
    } else {
      console.log('not authenticated')
      res.send('false')
    }
  }


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

  var linkArr = [ensureAuthenticated, expanderController.expandURL, watsonController.getTitle, watsonController.getKeywords, linkController.saveToDB];
  app.post('/api/links', linkArr, function (req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Facebook Auth routes
  // -----------------

  app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){});
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/apitest.html' }),
  function(req, res) {
    console.log('im here')
    res.json('success');
  });

  // -----------------
  // Single controller routes
  // -----------------

  app.post('/api/test', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  app.get('/api/bias', biasController.getData);
  app.get('/api/twitter', twitterSearch.getTweetsOnTopic);

  // -----------------
  // Handles popup routes for watson's emotions and sentiment
  // -----------------

  app.post('/api/popover', popupArr, function(req, res, next) {
    res.json(res.compoundContent);
  });


  // Dummy data for testing popover
  app.post('/api/popover/test', watsonTestController.data);
};
