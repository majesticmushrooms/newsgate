const expanderController = require('../controllers/expanderController.js');
const newsController = require('../controllers/newsController.js');
const watsonController = require('../watson/watsonController.js');
const biasController = require('../bias/biasController.js');
const linkController = require('../controllers/linkController.js');
const watsonTestController = require ('../watson/testDataController.js');
const googleTrends = require('../trends/googleTrends');
const twitterSearch = require('../trends/twitterTrends');
const memoizedData = require('../controllers/memoizedDataController.js');
const passport = require('passport');
const ensureAuthenication = require('../controllers/ensureAuthentication.js');

module.exports = function (app, express) {

/*
This middlware builds the response object starting with the URL expansion and tacking on the successive API calls by calling the controllers' next() function. You'll likely want to improve upon this by creating different endpoints with different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe just for talking to Watson and so forth.
*/

  // -----------------
  // Facebook Authentication Routes
  // -----------------

  app.get('/login', function(req, res) {
    res.redirect('/login/facebook');
  });

  app.get('/login/check', function(req, res) {
    if (req.user) {
      res.json({userId: req.user.id});
    } else {
      res.redirect('/');
    }
  });

  app.get('/login/facebook',
    passport.authenticate('facebook'),
    function(req, res) {
      console.log(req.user.id, ':req.user.id');
      res.json({userId: req.user.id});
    });

  app.get('/login/facebook/return', passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res) {

      res.json({userId: req.user.id});

    });

  app.get('/logout', function(req, res) {
    req.logOut();
    res.json({status: 'logout success'});
  });

  // -----------------
  // Main API route
  // -----------------

  var apiArr = [watsonController.getTitle, memoizedData.readAPIData, newsController.isFakeNews, watsonController.getKeywords, twitterSearch.getTweetsOnTopic, googleTrends.getGoogleTrends, memoizedData.recordAPIData];

  app.post('/api', apiArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Popover route
  // -----------------

  var popupArr = [watsonController.getTitle, memoizedData.readPopoverData, newsController.isFakeNews, watsonController.getEmotions, watsonController.getSentiment, biasController.getData, memoizedData.recordPopoverData];

  app.post('/api/popover', popupArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // Dummy data for testing popover
  app.post('/api/popover/test', watsonTestController.data);


  // -----------------
  // Report Card route
  // -----------------

  var reportcardArr = [watsonController.getTitle, watsonController.getEmotions, watsonController.getSentiment, biasController.getData];

  app.post('/api/reportcard', reportcardArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Links routes
  // -----------------

  var linkArr = [ensureAuthenication.authenticated, watsonController.getTitle, watsonController.getKeywords, linkController.saveToDB];

  app.post('/api/links', linkArr, function (req, res, next) {
    res.json(res.compoundContent);
  });

  app.get('/api/links', [ensureAuthenication.authenticated, linkController.getLinks], function(req, res, next) {
    res.json(res.compoundContent);
  });

  app.get('/api/links/test', [linkController.getLinksTest], function(req, res, next) {
    res.json(res.compoundContent);
  });


  // -----------------
  // Authenticated Display routes
  // -----------------
  app.get('/viewlinks', [ensureAuthenication.authenticated], function(req, res, next) {
    res.redirect('/linkDisplay.html');
  });
  

  // -----------------
  // Single controller routes
  // -----------------
  app.post('/api/test', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  app.post('/api/bias', [watsonController.getTitle, biasController.getData], function (req, res, next) {
    res.json(res.compoundContent);
  });
  app.get('/api/bias', biasController.getAll);
  app.get('/api/twitter', twitterSearch.getTweetsOnTopic);
};
