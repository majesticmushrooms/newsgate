var biasData = require('./biasrating.json');
var url = require('url');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports = {

  getData: function (req, res, next) {
    console.log('Getting Bias Rating');

    if (req.body.url) {
      var domain = req.body.url.replace(/^https?:\/\//, ''); // replace http and https
      domain = domain.replace(/www.?/, ''); //replace www. or www

      domain = domain.split('/')[0]; //Get the domain and only the domain

      if (domain) {
        var biasResult = (biasData[domain] === undefined) ? null : [biasData[domain].rating];

        var response = {
          // 'fullUrl': req.body.url,
          'url': domain,
          'status': (biasResult === null) ? '' : 'OK',
          'bias': biasResult
        };
        res.compoundContent = res.compoundContent || {};
        res.compoundContent['bias'] = response;
        next();

      } else {
        sendJSONresponse(res, 404, {
          'message': domain + ' is a malformed url'
        });
      }

    } else {
      sendJSONresponse(res, 404, {
        'message': 'no url in request'
      });
    }
  },

  getAll: function (req, res) {
    res.status(200).json({data: biasData});
  }

};

