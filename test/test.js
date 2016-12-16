var expect = require('chai').expect;
var request = require('request');

describe('Server Endpoints: ', function() {

  var hostname = 'http://127.0.0.1:8000';

  const TIME_OUT = 12000;

  describe('/api - post', function() {

    var nyTimes = {
      'uri': hostname + '/api',
      'method': 'POST',
      'followAllRedirects': true,
      'json': {'url': 'http://www.nytimes.com/2016/12/15/opinion/to-understand-trump-learn-russian.html?action=click&pgtype=Homepage&clickSource=story-heading&module=opinion-c-col-left-region&region=opinion-c-col-left-region&WT.nav=opinion-c-col-left-region'}
    };

    var nyTimesRes = {};

    describe('waiting for request response before starting tests', function() {

      before(function(done) {

        this.timeout(TIME_OUT);

        request(nyTimes, function(err, res, body) {
          nyTimesRes = res;
          done();
        });
      });

      it('should only handle real urls, sending 404 for invalid URLs', function(done) {

        var fakeUrl = {
          'uri': hostname + '/api',
          'method': 'POST',
          'followAllRedirects': true,
          'json': {'url': 'not a real url'}
        };

        request(fakeUrl, function(err, res, body) {
          expect(res.statusCode).to.equal(404);
          done();
        });

      });

      it('expand urls, and treat them as it would treat direct links', function(done) {

        this.timeout(TIME_OUT);

        var shortnedUrl = {
          'uri': hostname + '/api',
          'method': 'POST',
          'followAllRedirects': true,
          'json': {'url': 'nyti.ms/2hSE2MQ'}
        };

        var expandedUrl = {
          'uri': hostname + '/api',
          'method': 'POST',
          'followAllRedirects': true,
          'json': {'url': 'http://www.nytimes.com/2016/12/15/us/pew-study-obama-september-11.html?src=twr&smid=tw-nytimes&smtyp=cur'}
        };

        request(shortnedUrl, function(err1, res1, body1) {
          request(expandedUrl, function(err2, res2, body2) {
            //Set meta data equal, because this will very by request
            res1.body.twitter = res2.body.twitter;
            expect(res1.body).to.deep.equal(res2.body);
            done();
          });
        });

      });

      it('should detect fake news sites correctly', function(done) {

        this.timeout(TIME_OUT);

        var theOnion = {
          'uri': hostname + '/api',
          'method': 'POST',
          'followAllRedirects': true,
          'json': {'url': 'http://www.theonion.com/infographic/can-trump-follow-through-his-campaign-promises-54792'}
        };

        request(theOnion, function(err, theOnionRes, body) {

          expect(nyTimesRes.body).to.have.property('fake');
          expect(nyTimesRes.body.fake.rating.score).to.equal(0);
          expect(theOnionRes.body).to.have.property('fake');
          expect(theOnionRes.body.fake.rating.score).to.equal(100);

          done();
        });

      });

      it('Watson should find the site\'s title', function(done) {

        expect(nyTimesRes.body.title).to.have.property('status');
        expect(nyTimesRes.body.title.status).to.equal('OK');
        expect(nyTimesRes.body.title.title).to.be.a('string');
        expect(nyTimesRes.body.title.title.length).to.be.above(0);

        done();
      });

      it('Watson should find the site\'s keywords', function(done) {

       // .keywords.status === okay
        expect(nyTimesRes.body.keywords).to.have.property('status');
        expect(nyTimesRes.body.keywords.status).to.equal('OK');
        expect(nyTimesRes.body.keywords.keywords).to.be.an('array');
        nyTimesRes.body.keywords.keywords.forEach(function(keyword) {
          expect(keyword.text).to.be.a('string');
          expect(keyword.relevance).to.be.above(0);
          expect(keyword.relevance).to.be.below(1);
        });

        done();
      });

      it('Twitter search should find tweets', function(done) {

        expect(nyTimesRes.body.twitter.statuses).to.be.an('array');
        expect(nyTimesRes.body.twitter.statuses.length).to.above(0);
        nyTimesRes.body.twitter.statuses.forEach(function(tweet) {
          expect(tweet.text).to.be.a('string');
        });

        done();
      });

      it('Google trends should return queries', function(done) {

        expect(nyTimesRes.body.google).to.be.an('array');
        expect(nyTimesRes.body.google.length).to.above(0);
        nyTimesRes.body.google.forEach(function(query) {
          expect(query.query).to.be.a('string');
        });

        done();
      });
    });
  });

  describe('/api/popover - post', function() {

    describe('waiting for request response before starting tests', function() {

      var waPost = {
        'uri': hostname + '/api/popover',
        'method': 'POST',
        'followAllRedirects': true,
        'json': {'url': 'https://www.washingtonpost.com/news/business/wp/2016/12/15/on-the-day-trump-said-hed-clarify-his-business-dealings-his-conflicts-of-interest-look-thornier-than-ever/?hpid=hp_hp-top-table-main_trumpbiz-1015a%3Ahomepage%2Fstory&utm_term=.fbbe3929e70f'}
      };

      var waPostRes = {};

      before(function(done) {

        this.timeout(TIME_OUT);

        request(waPost, function(err, res, body) {
          waPostRes = res;
          done();
        });
      });

      it('Watson should find the site\'s title', function(done) {

        expect(waPostRes.body.title).to.have.property('status');
        expect(waPostRes.body.title.status).to.equal('OK');
        expect(waPostRes.body.title.title).to.be.a('string');
        expect(waPostRes.body.title.title.length).to.be.above(0);

        done();
      });

      it('should detect fake news sites correctly', function(done) {

        this.timeout(TIME_OUT);

        var theOnion = {
          'uri': hostname + '/api',
          'method': 'POST',
          'followAllRedirects': true,
          'json': {'url': 'http://www.theonion.com/infographic/can-trump-follow-through-his-campaign-promises-54792'}
        };

        request(theOnion, function(err, theOnionRes, body) {

          expect(waPostRes.body).to.have.property('fake');
          expect(waPostRes.body.fake.rating.score).to.equal(0);
          expect(theOnionRes.body).to.have.property('fake');
          expect(theOnionRes.body.fake.rating.score).to.equal(100);

          done();
        });
      });
      it('Watson should find a site\'s emotions', function(done) {

        expect(waPostRes.body.emotions).to.have.property('status');
        expect(waPostRes.body.emotions.status).to.equal('OK');
        expect(waPostRes.body.emotions.docEmotions.anger).to.be.above(0);
        expect(waPostRes.body.emotions.docEmotions.anger).to.be.below(1);
        expect(waPostRes.body.emotions.docEmotions.disgust).to.be.above(0);
        expect(waPostRes.body.emotions.docEmotions.disgust).to.be.below(1);
        expect(waPostRes.body.emotions.docEmotions.fear).to.be.above(0);
        expect(waPostRes.body.emotions.docEmotions.fear).to.be.below(1);
        expect(waPostRes.body.emotions.docEmotions.joy).to.be.above(0);
        expect(waPostRes.body.emotions.docEmotions.joy).to.be.below(1);
        expect(waPostRes.body.emotions.docEmotions.sadness).to.be.above(0);
        expect(waPostRes.body.emotions.docEmotions.sadness).to.be.below(1);

        done();
      });

      it('Watson should find a site\'s sentiment', function(done) {

        expect(waPostRes.body.sentiment).to.have.property('status');
        expect(waPostRes.body.sentiment.status).to.equal('OK');
        expect(waPostRes.body.sentiment.docSentiment.type).to.be.a('string');

        done();

      });

      it('should determine a new site\'s polical bias', function(done) {

        expect(waPostRes.body.bias).to.have.property('status');
        expect(waPostRes.body.bias.status).to.equal('OK');
        expect(waPostRes.body.bias.bias).to.exist;
        done();
      });
    });
  });
  describe('/api/links - post', function() {

    describe('waiting for request response before starting tests', function() {

      var npr = {
        'uri': hostname + '/api/links',
        'method': 'POST',
        'followAllRedirects': true,
        'json': {'url': 'http://www.npr.org/sections/parallels/2016/12/15/505571306/how-will-rex-tillerson-explain-exxon-mobils-foreign-policy'}
      };

      var nprRes = {};

      before(function(done) {

        this.timeout(TIME_OUT);

        request(npr, function(err, res, body) {
          nprRes = res;
          done();
        });
      });

      it('Watson should find the site\'s title', function(done) {

        expect(nprRes.body.title).to.have.property('status');
        expect(nprRes.body.title.status).to.equal('OK');
        expect(nprRes.body.title.title).to.be.a('string');
        expect(nprRes.body.title.title.length).to.be.above(0);


        done();
      });

      it('Watson should find the site\'s keywords', function(done) {

        expect(nprRes.body.keywords).to.have.property('status');
        expect(nprRes.body.keywords.status).to.equal('OK');
        expect(nprRes.body.keywords.keywords).to.be.an('array');
        nprRes.body.keywords.keywords.forEach(function(keyword) {
          expect(keyword.text).to.be.a('string');
          expect(keyword.relevance).to.be.above(0);
          expect(keyword.relevance).to.be.below(1);
        });

        done();
      });

      it('the link controller should return link properties', function(done) {

        expect(nprRes.body.link).to.have.property('url');
        expect(nprRes.body.link.url).to.equal(nprRes.body.title.url);
        expect(nprRes.body.link).to.have.property('title');
        expect(nprRes.body.link.title).to.equal(nprRes.body.title.title);
        expect(nprRes.body.link.keywords).to.be.an('array');
        nprRes.body.link.keywords.forEach(function(keyword) {
          expect(keyword.text).to.be.a('string');
          expect(keyword.relevance).to.be.above(0);
          expect(keyword.relevance).to.be.below(1);
        });

        done();
      });
    });
  });

  describe('/api/bias - post', function() {
    describe('waiting for request response before starting tests', function() {

      var usaToday = {
        'uri': hostname + '/api/bias',
        'method': 'POST',
        'followAllRedirects': true,
        'json': { 'url': 'http://www.usatoday.com/story/news/politics/2016/12/15/obama-threatens-retaliation-against-russia-election-hacking/95501584/'}
      };

      var usaTodayRes = {};

      before(function(done) {

        this.timeout(TIME_OUT);

        request(usaToday, function(err, res, body) {
          usaTodayRes = res;
          done();
        });
      });

      it('should find if the site it biased', function(done) {
        expect(usaTodayRes.body.bias).to.have.property('url');
        expect(usaTodayRes.body.bias.url).to.be.a('string');
        expect(usaTodayRes.body.bias).to.have.property('status');
        expect(usaTodayRes.body.bias.status).to.be.a('string');
        expect(usaTodayRes.body.bias.status).to.equal('OK');
        expect(usaTodayRes.body.bias).to.have.property('bias');
        expect(usaTodayRes.body.bias.bias.length).to.be.above(0);
        expect(usaTodayRes.body.bias.bias[0]).to.be.a('string');
        
        done();
      });

    });
  });

});


