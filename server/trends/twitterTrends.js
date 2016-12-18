var Twitter = require('twitter');
var Promise = require('bluebird');
var keys = require('./twitterAPIKey');
var bodyParser = require('body-parser');

var twitter = new Twitter({
  'consumer_key': keys.consumer_key,
  'consumer_secret': keys.consumer_secret,
  'access_token_key': keys.access_token_key,
  'access_token_secret': keys.access_token_secret
});

twitter = Promise.promisifyAll(twitter);

exports.getTweetsOnTopic = function(req, res, next) {
  // var keywords = res.compoundContent.title.title.slice(0,20);
  // console.log('twitter search titel: ', typeof res.compoundContent.title.title);

  var _filterKeywords = function(keywords) {
    var outputKeywords = [];
    if (keywords.length > 0) {
    outputKeywords = keywords.slice(0, 2);
    outputKeywords = outputKeywords.map(keyword => {
      var newkeyword = {};
      newkeyword.relevance = keyword.relevance;
      newkeyword.text = keyword.text.toLowerCase();
      var solutations = /\b(m[rs]s*)\b\.*/gi;
      newkeyword.text = newkeyword.text.replace(solutations, ''); //get rid of mr. and mrs.
      newkeyword.text = newkeyword.text.trim();
      console.log(keyword, 'in map keyword');
      console.log(newkeyword, 'in map newkeyword');

      return newkeyword;
    });
  }
    //outputKeywords = keywords.filter(keyword => keyword.relevance > 0.75)
    return outputKeywords;
  };

  var domain = req.body.url.replace(/^https?:\/\//, ''); // replace http and https
  domain = domain.replace(/www.?/, ''); //replace www. or www

  domain = domain.split('/')[0]; //Get the domain and only the domain

  domain = domain.slice(0, -4);

  var query = _filterKeywords(res.compoundContent.keywords.keywords).map(function(keyword) {
    return keyword.text;
  });

  query = query.join(' ');
  query = query.replace(/ /g, ' OR ');
  query += ' ' + domain;

  console.log('joined query', query);


  twitter.getAsync('search/tweets', {q: query, result_type: 'popular', count: 20})
  .then(function(data) {
    console.log(data);
    res.compoundContent['twitter'] = data;
    next();
    //res.send(data);
  })
  .catch(function(err) {
    console.error('Error with Twitter GET request', err);
  });
};
