var url = require('url');
var SavedLink = require('../models/linkModel.js');

var __filterKeywords = function(keywords) {
  var outputKeywords = [];
  outputKeywords = keywords.slice(0, 5);
  outputKeywords = outputKeywords.map(keyword => {
    var newkeyword = {};
    newkeyword.relevance = keyword.relevance;
    newkeyword.text = keyword.text.toLowerCase();
    var solutations = /\b(m[rs]s*)\b\.*/gi;
    newkeyword.text = newkeyword.text.replace(solutations, ''); //get rid of mr. and mrs.
    newkeyword.text = newkeyword.text.trim();

    return newkeyword;
  });
  //outputKeywords = keywords.filter(keyword => keyword.relevance > 0.75)
  return outputKeywords;
};

module.exports = {

  saveToDB: function(req, res, next) {
    var parsedUrl = url.parse(req.body.url);
    var lookupUrl = parsedUrl.host + parsedUrl.pathname;

    var filtered = __filterKeywords(res.compoundContent['keywords'].keywords);
    var linkData = {
      name: req.user.displayName,
      fbID: req.user.id,
      url: lookupUrl,
      title: res.compoundContent.title.title,
      keywords: filtered
    };

    // if the link doesn't exist for that user, create it
    SavedLink.findOne({fbID: linkData.fbID, title: linkData.title, url: linkData.url}, function(err, link) {
      if (err) {
        console.log('err', err);
      } else if (link === null) {
        var newLinkSave = new SavedLink(linkData);
        newLinkSave.save(function(err, data) {
          if (err) {
            console.log(err);
          }
          res.compoundContent = res.compoundContent || {};
          res.compoundContent['link'] = linkData;
          next();
        });
        console.log('User saved: ', linkData.url);
      } else {
        console.log('link', link);
        console.log('User already saved this link');
      }
    });
  },

  getLinks: function(req, res, next) {
    if (req.user.id) {
      SavedLink.find({fbID: req.user.id})
      .exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        if (data) {
          console.log('found link data', data);
          res.compoundContent = res.compoundContent || {};
          res.compoundContent['link'] = data;
          next();
        }
      });
    } else {
      //No user id found
      res.sendStatus(403);
    }
  },

  getLinksTest: function(req, res, next) {
    // SavedLink.find({fbID: '3609663193669'})
    // .exec(function(err, data) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   if (data) {
    //     console.log('found link data', data);
    //     res.compoundContent = res.compoundContent || {};
    //     res.compoundContent['link'] = data;
    //     next();
    //   }
    // });
    
  }
};
