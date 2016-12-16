var express = require('express');

module.exports.data = function(req, res) {
  var testData = [
    {
      bias: {
        bias: 'Left'
      },
      emotions: {
        docEmotions: {
          anger: 0.2,
          disgust: 0.8,
          fear: 0.5,
          joy: 0.1,
          sadness: 0.3
        }
      },
      sentiment: {
        docSentiment: {
          type: 'negative'
        }
      },
      fake: {
        rating: {
          score: 100
        }
      }
    },

    {
      bias: {
        bias: 'Right'
      },
      emotions: {
        docEmotions: {
          anger: 0.2,
          disgust: 0.2,
          fear: 0.5,
          joy: 0.7,
          sadness: 0.3
        }
      },
      sentiment: {
        docSentiment: {
          type: 'positive'
        }
      },
      fake: {
        rating: {
          score: 0
        }
      }
    },

    {
      bias: {
        bias: 'Left'
      },
      emotions: {
        docEmotions: {
          anger: 0.6,
          disgust: 0.3,
          fear: 0.5,
          joy: 0.1,
          sadness: 0.8
        }
      },
      sentiment: {
        docSentiment: {
          type: 'positive'
        }
      },
      fake: {
        rating: {
          score: 0
        }
      }
    }
  ];

  var randIndex = Math.floor(Math.random() * testData.length);
  setTimeout(function() {
    res.send(testData[randIndex]);
  }, 3000);
};