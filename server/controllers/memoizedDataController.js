var url = require('url');
const memoizedData = require('../models/memoizedDataModel.js');

var Popover = memoizedData.popover;
var API = memoizedData.api;

var recordData = function(req, res, next, model) {
  console.log('\n\n model \n\n', model);
  if (req.body.url) {
    if (res.hasOwnProperty('compoundContent')) {
      var parsedUrl = url.parse(req.body.url);
      var lookupUrl = parsedUrl.host + parsedUrl.pathname;

      model
      .findOne({url: lookupUrl})
      .exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        if (!data) {
          console.log('no entry found, recording...');
          var newEntry = new model({url: lookupUrl, response: res.compoundContent});

          newEntry.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  }
  next();
};

var readData = function(req, res, next, model) {
  if (req.body.url) {
    var parsedUrl = url.parse(req.body.url);
    var lookupUrl = parsedUrl.host + parsedUrl.pathname;

    model
    .findOne({url: lookupUrl})
    .exec(function(err, data) {
      if (err) {
        console.log(err);
      }
      if (data) {
        console.log('found data on read');
        console.log('resonding with', data.response);
        //found result in database
        res.json(data.response);
      } else {
        console.log('did not found data on read');
        //did not find result
        next();
      }
    });

  } else {
    next();
  }
};

module.exports.recordPopoverData = function(req, res, next) {
  recordData(req, res, next, Popover);
};

module.exports.readPopoverData = function(req, res, next) {
  readData(req, res, next, Popover);
};

module.exports.recordAPIData = function(req, res, next) {
  recordData(req, res, next, API);
};

module.exports.readAPIData = function(req, res, next) {
  readData(req, res, next, API);
};
