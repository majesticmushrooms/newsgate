var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
// var request = require('supertest');
var request = require('request');
var Promise = require('bluebird');
mongoose.Promise = Promise;
//var app = require('../server/server.js');

chai.use(require('chai-things'));



describe('NewsGate API', function () {



  describe('/api/popover', function () {
    it('should get some data after asking for some popup', function (done) {
      var options = { 
        method: 'POST',
        url: 'http://localhost:8000/api/links',
        headers:  { 'content-type': 'application/json' },
        body: { url: 'http://www.nytimes.com/2016/12/13/us/politics/russia-hack-election-dnc.html' },
        json: true 
      };

      console.log('we are here');
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log('in the call back for request');
        expect(123).to.equal(333);
      });
      done();
    });
  });
});