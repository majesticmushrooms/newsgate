var googleTrends = require('google-trends-api');
//API documentation: https://www.npmjs.com/package/google-trends-api
// var bodyParser = require('body-parser');


exports.getGoogleTrends = function(req, res, next) {


  var top3Keywords = res.compoundContent.keywords.keywords.map(function(word) { return word.text; }).slice(0,3);
  var combinedKeywords = top3Keywords.join(' ');

  //If too many words in search query, Google trends will not return resutls
  if (combinedKeywords.split(' ').length > 3) {
    var searchTerms = top3Keywords;
  } else {
    var searchTerms = [combinedKeywords].concat(top3Keywords);
  }


  console.log('search terms:', searchTerms);

  var timePeriod = {
    type: 'day',   //resolution of returned data
    value: 5      //goes back 7 days
  }
  googleTrends.trendData({keywords: searchTerms, timePeriod: timePeriod})
  .then(function(data) {
    res.compoundContent['google'] = data;
    // console.log(data);
    next();
  })
  .catch(function(err) {
    console.error('Error with Google trends GET request', err);
  });
};
