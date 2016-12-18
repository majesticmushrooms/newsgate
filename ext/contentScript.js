$(document).ready(function() {
  var flag = null;
  var newsSites;

  // ---------------
  // Handles request for news articles
  // ---------------

  // when the doc is ready, get the json data
  $.ajax({
    url: 'http://localhost:8000/api/bias',
    type: 'GET'
  })
  .done(function(json) {
    console.log('retrieved all json news sites');
    newsSites = json.data;
  })
  .fail(function() {
    console.log('get req failure');
  });

  // ---------------
  // Handles check if url is news site
  // ---------------

  var isItNews = function(url) {
    // convert url to just domain
    var domain = url.replace(/^https?:\/\//, ''); // replace http and https
    domain = domain.replace(/www.?/, ''); //replace www. or www
    domain = domain.split('/')[0]; //Get the domain and only the domain
    //returns true or false
    // console.log(newsSites);
    return newsSites[domain] !== undefined;
  };

  // ---------------
  // Handles creation of popover
  // ---------------

  var gifUrl = chrome.extension.getURL('contentScriptAssets/spin.gif');
  $('a').attr('data-toggle', 'popover')
  .popover({
    html: true,
    animation: true,
    container: 'body',
    trigger: 'manual',
    placement: 'auto top',
    title: 'Article Quick Stats',
    content: '<img class="gifLoading" src="' + gifUrl + '"/>'
  })

  // ---------------
  // Handles popover show
  // ---------------

  // when the user hovers over a link
  .on('mouseenter', function () {
    var hoverUrl = $(this).attr('href');
    if (hoverUrl[0] === '/') {
      hoverUrl = window.location.hostname + hoverUrl;
    }
    flag = hoverUrl;
    var $context = $(this);
    var context = this;

    // if it's a news site and still hovering over link, show popover
    if (isItNews(hoverUrl)) {
      setTimeout(function() {
        var currHoverUrl = $context.attr('href');
        if (flag === hoverUrl) { 
          $context.popover('show');
          // hide popover when user stops hovering over popover
          $('.popover').on('mouseleave', function() {
            $context.popover('hide');
          });
        }
      }, 500);
    }

  // ---------------
  // Handles popover hide
  // ---------------

  // hide the popover when the user stops hovering over link
  }).on('mouseleave', function () {
    flag = null;
    // console.log('mouseleave link');
    var $context = $(this);
    setTimeout(function() {
      if ( !$('.popover:hover').length ) {
        $context.popover('hide');
      }
    }, 200);
  });

  // ---------------
  // Handles request for popover content
  // ---------------

  $('a').hover(
    function(e) {
      var $context = $(this);
      var hoverUrl = $(this).attr('href');
      // if not complete url, attach to domain
      if (hoverUrl[0] === '/') {
        hoverUrl = window.location.hostname + hoverUrl;
      }

      setTimeout(function() {
        if (isItNews(hoverUrl) && flag === hoverUrl) {
          // retrieve popover content 
          $.ajax({
            url: 'http://localhost:8000/api/popover/test',
            type: 'POST',
            data: {'url': hoverUrl},
            dataType: 'json'
          })

          // ---------------
          // Handles adding content to popover
          // ---------------

          .done(function(json) {
            console.log('got news data');
            content = '<div>';
            
            // add fake news to content
            var fakeScore = json.fake.rating.score;
            if ((json.fake.rating.score + '') === '0') {
              var fake = 'nope';
            } else if ((json.fake.rating.score + '') === '100') {
              var fake = 'yes';
            }
            content += '<p>' + '<span class="popoverTitles">' + 'Fake News?: ' + '</span>' + fake + '</p>';

            // add bias to content
            var leaningGifs = {
              Right: '<img class="gifLeaning" src="' + chrome.extension.getURL("contentScriptAssets/elephant.gif") + '"/>',
              Left: '<img class="gifLeaning" src="' + chrome.extension.getURL("contentScriptAssets/elephant.gif") + '"/>'
            };
            var leaning = json.bias.bias;
            content += '<p>' + '<span class="popoverTitles">' + 'Leaning: ' + '</span>' + leaning.toLowerCase() + '</p>';

            // add emotions to content
            var emotions = json.emotions.docEmotions;
            var emos = {};
            for (var emo in emotions) {
              emos[emo] = emotions[emo] > 0.5;
            }
            content += '<p>' + '<span class="popoverTitles">' + 'Emotions: ' + '</span>';
            for (var emo in emos) {
              if (emos[emo]) {
                content += emo + ', ';
              }
            }
            if (content[content.length - 2] === ':') {
              content += 'N/A';
            } else {
              content = content.slice(0, -2) + '</p>';
            }

            // add sentiment to content
            var sentiment = json.sentiment.docSentiment.type;
            content += '<p>' + '<span class="popoverTitles">' + 'Sentiment: ' + '</span>' + sentiment + '</p>';

            // add report card to content
            content += '<p><a class="viewReportCard">View Report Card</a><a class="heart"> ♥ </a></p>';
            content += '</div>';

            // set content to popover
            $context.attr('data-content', content).data('bs.popover').setContent();

            // ---------------
            // Handles adding fav link
            // ---------------

            $('.heart').on('click', function() {
              $.ajax({
                url: 'http://localhost:8000/api/links',
                type: 'POST',
                data: {url: hoverUrl},
                dataType: 'json'
              })
              .done(function(json) {
                console.log(json);
                console.log('completed post req to api/links');
              })
              .fail(function() {
                console.log('failure on post req to api/links');
              });
            });

            // ---------------
            // Handles viewing report card in new tab
            // ---------------

            $('.viewReportCard').on('click', function() {
              window.open('http://localhost:8000/?' + hoverUrl);
            });

          })

          .fail(function() {
            console.log('post req failure');
          });
        }
      }, 500);
    }
  );
});


