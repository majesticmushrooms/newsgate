$(document).ready(function() {

  // create popover
  var gifUrl = chrome.extension.getURL('contentScriptAssets/spin.gif');
  $('a').attr('data-toggle', 'popover').popover({
    html: true,
    animation: true,
    container: 'body',
    trigger: 'manual',
    placement: 'auto top',
    title: 'Article Quick Stats',
    content: '<img class="gifLoading" src="' + gifUrl + '"/>'
  })
  // keep popover open while hovering over popover
  .on('mouseenter', function () {
    var $context = $(this);
    var context = this;
    // check if site is a news site
    var hoverUrl = $(this).attr('href');
    if (hoverUrl[0] === '/') {
      console.log('hostname', window.location.hostname);
      hoverUrl = window.location.hostname + hoverUrl;
    }
    $.ajax({
      url: 'http://localhost:8000/api/bias',
      type: 'POST',
      data: {'url': hoverUrl},
      dataType: 'json'
    })

    .done(function(json) {
      if (json.bias.status === 'OK') {
        // slight delay on popover show
        setTimeout(function () {
          // console.log( $('context:hover').length === 0 );
          if ( $('context:hover').length === 0 ) {
            console.log($context.popover('show'));
            $context.popover('show'); // this isn't working
            $('.popover').on('mouseleave', function () {
              console.log('mouseleave');
              $context.popover('hide');
            });
          }
        }, 1000);
      }
    })

    .fail(function() {
      console.log('post req failure');
    });

  // close popover on mouseleave
  }).on('mouseleave', function () {
    var $context = $(this);
    // delay on popover hide, when not hovering over popover itself
    setTimeout(function () {
      if ( !$('.popover:hover').length ) {
        $context.popover('hide');
      }
    }, 200);
  });

  $('a').hover(
    function(e) {
      var $context = $(this);
      var hoverUrl = $(this).attr('href');
 
      // if not complete url, attach to domain
      if (hoverUrl[0] === '/') {
        hoverUrl = window.location.hostname + hoverUrl;
      }
      
      // retrieve popover content 
      $.ajax({
        url: 'http://localhost:8000/api/popover/test',
        type: 'POST',
        data: {'url': hoverUrl},
        dataType: 'json'
      })

      .done(function(json) {
        // console.log(json);
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
          // console.log(emo, emotions[emo]);
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
        content += '<p>' + '<span class="popoverTitles">' + 'Sentiment: ' + '</span>' + sentiment +  '</p>';

        // add report card to content
        content += '<p><a>View Report Card</a><span class="heart"> ♥ </span></p>';
        content += '</div>';

        // set content to popover
        $context.attr('data-content', content).data('bs.popover').setContent();
      })

      .fail(function() {
        console.log('post req failure');
      });
      
    }
  );

});


