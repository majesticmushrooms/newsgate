$(document).ready(function() {
  var flag = null;
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
    var $context = $(this); // refers to 'a' tag
    var context = this;

    // check if domain is a news site
    $.ajax({
      url: 'http://localhost:8000/api/bias',
      type: 'POST',
      data: {'url': hoverUrl},
      dataType: 'json'
    })

    .done(function(json) {
      // if it's a news site
      if (json.bias.status === 'OK') {
        // wait one second
        setTimeout(function () {
          // if user is still hovering over link
          // console.log('flag: ', flag, 'json.bias.fullUrl: ', json.bias.fullUrl);
          if (flag === json.bias.fullUrl) {
            //show the popover
            $context.popover('show');
            // hide popover when user stops hovering over popover
            $('.popover').on('mouseleave', function () {
              // console.log('mouseleave popover');
              $context.popover('hide');
            });
          }
        }, 500);
      }


    })

    .fail(function() {
      console.log('post req failure');
    });

  // ---------------
  // Handle popover hide
  // ---------------

  // hide the popover when the user stops hovering over link
  }).on('mouseleave', function () {
    flag = null;
    // console.log('mouseleave link');
    var $context = $(this);
    if ( !$('.popover:hover').length ) {
      $context.popover('hide');
    }
  });

  // ---------------
  // Handles popover content
  // ---------------

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
        content += '<p>' + '<span class="popoverTitles">' + 'Sentiment: ' + '</span>' + sentiment + '</p>';

        // add report card to content
        content += '<p><a><span>View Report Card</span><span class="heart"> ♥ </span> </a></p>';
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


