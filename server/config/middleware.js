var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var facebookAPIKey = require('../trends/facebookAPIKey.js');



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}



module.exports = function (app, express) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);
  app.use(express.static(__dirname + './../../client'));

  passport.use(new Strategy({
    clientID: facebookAPIKey.clientID,
    clientSecret: facebookAPIKey.clientSecret,
    callbackURL: 'http://localhost:8000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    //cb(null, profile);
    return cb(null, profile);
  }));
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());
};

