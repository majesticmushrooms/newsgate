/*
Alchemy Language API

for more information see https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node

*/
var watson = require('watson-developer-cloud');
var watsonKey = require('./watson_api_key.js');
var alchemy_language = watson.alchemy_language({
  api_key: watsonKey.watsonKey
});

// -----------------
// Extract the page title from a webpage or HTML.
// https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#title_extraction
// -----------------

module.exports.getTitle = function(req, res, next) {
  console.log('request body', req.body.url);
  var parameters = {
    url: req.body.url
  };

  alchemy_language.title(parameters, function (err, response) {
    if (err) {
      console.log('error:', err);
        res.status(404).json({error: err});
    } else {
      console.log(JSON.stringify(response, null, 2));
      res.compoundContent = res.compoundContent || {};
      req.body.url = response.url;
      res.compoundContent['title'] = response;
      next();
    }
  });
};

// -----------------
// Extract keywords from a webpage, HTML, or plain text.
// https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#keywords
// -----------------

module.exports.getKeywords = function(req, res, next) {
  var parameters = {
    url: req.body.url
  };

  alchemy_language.keywords(parameters, function (err, response) {
    if (err) {
      console.log('error:', err);
      res.status(404).json({error: err});
    } else {
      console.log(JSON.stringify(response, null, 2));
      res.compoundContent['keywords'] = response;
      next();
    }
  });
};

// -----------------
// Detect emotions implied in plain text, on a webpage, or in HTML content.
// https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#emotion_analysis

// Response:
// docEmotions: Object containing emotion keys and score values (0.0 to 1.0).
  // If a score is above 0.5, then the text can be classified as conveying the corresponding emotion.
// -----------------

module.exports.getEmotions = function(req, res, next) {
	var parameters = {
		url: req.body.url
	};

	alchemy_language.emotion(parameters, function (err, response) {
		if (err) {
			console.log('error', err);
			res.status(404).json({error: err});
		} else {
			console.log(JSON.stringify(response, null, 2));
			res.compoundContent['emotions'] = response;
			next();
		}
	});
};

// -----------------
// Analyze the overall sentiment of a webpage, HTML, or plain text.
// https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#sentiment

// Response:
// docSentiment: Object containing document-level sentiment information
  // mixed  1 indicates that the sentiment is both positive and negative
  // score  Sentiment strength (0.0 == neutral)
  // type  Sentiment polarity: positive, negative, or neutral
// -----------------

module.exports.getSentiment = function(req, res, next) {
	var parameters = {
		url: req.body.url
	};

	alchemy_language.sentiment(parameters, function (err, response) {
		if (err) {
			console.log('error', err);
			res.status(404).json({error: err});

		} else {
			console.log(JSON.stringify(response, null, 2));
			res.compoundContent['sentiment'] = response;
			next();
		}
	});
};

