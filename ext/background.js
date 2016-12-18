
$(document).ready(function() {
  chrome.storage.sync.set({'userId': null});
  $.ajax({
    url: 'http://localhost:8000/login/check',
    type: 'GET',
    dataType: 'json'
  }).done(function(results) {
    chrome.storage.sync.set({'userId': results.userId});
    console.log('recieved login check results:', results);
    if (result.userId) {
      console.log('UserId found');
    } else {
      console.log('No userId found');
    }
  });
});