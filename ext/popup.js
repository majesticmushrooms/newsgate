// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */


function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

var saveLink = function() {
  console.log('in save link');
  getCurrentTabUrl(function(url) {
    console.log(url);
    $.ajax({
      url: 'http://localhost:8000/api/links',
      type: 'POST',
      data: {'url': url},
      dataType: 'json'
    }).done(function(results) {
      console.log(results);
      if (results === false) {
        console.log('please login');
      } else {
        console.log(results);
        $('#SaveLink').text('Link Saved!');
      }
    });
  });
};

// Default value for userId
var userId = null;


var viewReport = function() {
  getCurrentTabUrl(function(url) {
    window.open('http://localhost:8000/?' + url);
  });
};

var viewLinks = function() {
  window.open('http://localhost:8000/viewlinks');
};

var showLoginButton = function(showLogin) {
  if (showLogin) {
    console.log('lets showoff some login');
    $('#login').show();
    $('#logout').hide();
  } else {
    console.log('put that login away');
    $('#logout').show();
    $('#login').hide();
  }
};

var updateLoginButton = function() {
  console.log('userId in updatebutton', userId);
  if (userId) {
    showLoginButton(false);
  } else {
    showLoginButton(true);
  }
};

var userIdChangeHandler = function(newId) {
  console.log('userIdChangeHandler');
  console.log('comparing current', userId);
  console.log('to new', newId);
  if (userId === newId) {
    console.log('same old same old');
    //No change
    return;
  } else {
    console.log('things about to get different');
    userId = newId;
    updateLoginButton();
  }
};

chrome.storage.sync.get('userId', function(result) {
  console.log('sync result', result);
  userIdChangeHandler(userId, result);
});

var facebookLogin = function() {
  console.log('attempt login');
  $.ajax({
    url: 'http://localhost:8000/login/facebook',
    type: 'GET',
  }).done(function(results) {
    console.log('login results', results);
    chrome.storage.sync.set({'userId': results.userId});
    chrome.storage.sync.get('userId', function(result) {
      console.log('check sync storage after settings', result);
    });
    userIdChangeHandler(results.userId);
  });
};

var facebookLogout = function() {
  console.log('attempt logout');
  $.ajax({
    url: 'http://localhost:8000/logout',
    type: 'GET',
  }).done(function(results) {
    console.log('logout results', results);
    chrome.storage.sync.set({'userId': null});
    userIdChangeHandler(null);
  });
};

$.ajax({
  url: 'http://localhost:8000/login/check',
  type: 'GET',
  dataType: 'json'
}).done(function(results) {
  chrome.storage.sync.set({'userId': results.userId});
  console.log('recieved login check results:', results);
  userIdChangeHandler(results.userId);
  if (results.userId) {
    console.log('UserId found');
  } else {
    console.log('No userId found');
  }
});

$(document).ready(function() {
  $('#SaveLink').on('click', saveLink);
  $('#ViewReport').on('click', viewReport);
  $('#ViewLinks').on('click', viewLinks);
  $('#login').on('click', facebookLogin);
  $('#logout').on('click', facebookLogout);

});
