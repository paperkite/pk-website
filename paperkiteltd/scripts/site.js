/**
 * A basic JavaScript file that refreshes the Squarespace ImageLoader. For more
 * information about writing custom JavaScript on a Squarespace developer site
 * visit the link below.
 * @see http://developers.squarespace.com/custom-javascript/
 *
 * This script wrapped in a Immediately-Invoked Function Expression (IIFE) to
 * prevent variables from leaking onto the global scope. For more information
 * on IIFE visit the link below.
 * @see http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
 */

 function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var $grid = {};

(function() {
  'use strict';

  // Stop the script if the user is on an old browser.
  // Browser support: http://caniuse.com/#search=queryselectorall
  if (!document.querySelectorAll) {
    return;
  }

  /**
   * Loads all images on the page using Squarespace's Responsive ImageLoader.
   *
   * @method loadImages
   * @see http://developers.squarespace.com/using-the-imageloader/
   */
    function loadAllImages() {
        var images = document.querySelectorAll('img[data-src]' );

        for (var i = 0; i < images.length; i++) {
            ImageLoader.load(images[i]);
        }
    }

    // =========================================
    // The event subscription that reloads images on resize.
    // =========================================
    document.addEventListener('resize', loadAllImages);
  
    $('.carousel').carousel()

    // =========================================
    // load instagram if needed
    // =========================================
    if (document.getElementById("instafeed")) {
      var feed = new Instafeed({
          get: 'user',
          userId: '2985688894',
          limit: 7,
          clientId: '2836f22d320f4ed0b492ac631249c301',
          accessToken: '2985688894.2836f22.ae2ac72abe374da395529caa7756a6a8',
          resolution: 'low_resolution',
          after: function() {
              var $meetTheTeam = $(".instagram-meet-team");
              $meetTheTeam.parent().append($meetTheTeam);
          },
          template: '<div class="instagram-photo"><a target="_blank" href="{{link}}"><img src="{{image}}" /></a></div>'
      });

      feed.run();
    }

    // =========================================
    // update the stats in the footer
    // =========================================
    function updateStats() {
      var currentTimestamp = Math.floor(Date.now() / 1000);
      var referenceTimestamp = 1458518718; // 21st of march 2015
      var referenceUniqueUsers = 1043355;
      var referenceSessions = 121903844;
      var referenceTimespent = 1357625; // hours
      var uniqueUsernow = (currentTimestamp * referenceUniqueUsers) / referenceTimestamp;
      var sessionsNow = (currentTimestamp * referenceSessions) / referenceTimestamp;
      var timespent = (currentTimestamp * referenceTimespent) / referenceTimestamp;

      // unique user
      var currentUniqueUsers = parseInt($("#unique-user").html().split(",").join(""));
      var uniqueUserAnim = new CountUp("unique-user", currentUniqueUsers, uniqueUsernow,0, 2.5);
      uniqueUserAnim.start();

      // unique sessions
      var currentSessionValue = parseInt($("#number-session").html().split(",").join(""));
      var sessionAnim = new CountUp("number-session", currentSessionValue, sessionsNow, 0, 3.5);
      sessionAnim.start();
      
      // time spent views
      var currentTimespentValue = parseInt($("#time-spent").html().split(",").join(""));
      var timespentAnim = new CountUp("time-spent", currentTimespentValue, timespent, 0, 3);
      timespentAnim.start();
    }

    window.setInterval(function(){
      updateStats()
    }, 3000);

    updateStats();

    // =========================================
    // hover effect team page
    // =========================================

    $(".member").on({
        mouseenter: function () {

            $(this).find("h3").removeClass('animated fadeInDown');
            $(this).find(".role").removeClass('animated fadeInDown');
            $(this).find(".twitter-handle").removeClass('animated fadeOutUp');
            $(this).find(".twitter-logo").removeClass('animated slideOutDown');              

            $(this).find("h3").addClass('animated fadeOutDown');
            $(this).find(".role").addClass('animated fadeOutDown');
            $(this).find(".twitter-handle").addClass('animated fadeInDown');
            $(this).find(".twitter-logo").addClass('animated slideInUp');            
        },
        mouseleave: function () {

            $(this).find("h3").removeClass('animated fadeOutDown');
            $(this).find(".role").removeClass('animated fadeOutDown');
            $(this).find(".twitter-handle").removeClass('animated fadeInDown');
            $(this).find(".twitter-logo").removeClass('animated slideInUp');           

            $(this).find("h3").addClass('animated fadeInDown');
            $(this).find(".role").addClass('animated fadeInDown');
            $(this).find(".twitter-handle").addClass('animated fadeOutUp');
            $(this).find(".twitter-logo").addClass('animated slideOutDown');            
        }
    });

    // =========================================
    // load the isotop grid for the blog
    // =========================================
    $(window).bind("load", function() {

        // init Isotope
        $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            // set layoutMode
            layoutMode: 'packery',
            packery: {
                gutter: 0
            },
            hiddenStyle: {
              opacity: 0
            },
            visibleStyle: {
              opacity: 1
            }
        });

        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
            });
        });

        $('#filters').on( 'click', 'button', function() {
            var filterValue = $( this ).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });

    });

    // =========================================
    // Load more button for the blog
    // =========================================
    var execute = true;
    var urlQuery = window.location.pathname;
    var currentPageIndex = parseInt(getParameterByName('page')); 
    if (isNaN(currentPageIndex)) {
      currentPageIndex = 2;
    } else {
      currentPageIndex++;
    }

    $(".blog #content").on( "click", "#load-more", function(event) {
      event.preventDefault();

      if (execute == false) { return; }
      execute = false;
    
      Y.io(urlQuery + '?page=' + currentPageIndex, {
          on: {
              success: function (x, o) {
                  
                  execute = true;
                  
                  var html = {}
                  
                  try {
                      html = $.parseHTML(o.responseText);
                  } catch (e) {
                      console.log("JSON Parse failed!");
                      console.log(e);
                      return;
                  }

                  var $newItems = $($(html).find('.grid').html())

                  if ($newItems.length == 0) {
                      // hide load more button
                      $("#load-more").addClass('hidden');
                      $("#load-more-container").find('span').first().removeClass('hidden');
                  }

                  $grid.append( $newItems ).isotope( 'appended', $newItems);

                  // dirty
                  setTimeout(function (){
                    $grid.isotope( 'layout');
                  }, 500); 

                  currentPageIndex++;
              }
          }
      });

    });

    // =========================================
    // Smooth scrolling
    // =========================================
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - 90
          }, 1000);
          return false;
        }
      }
    });


    // =========================================
    // Sticky header after scrolling on Home Page
    // =========================================
    var offset = 850;
    var affixElement = $('#sliding-navigation');

    $(window).scroll(function (event) {

        // what the y position of the scroll is
        var y = $(window).scrollTop();

        if (y >= offset) {
          affixElement.removeClass("slideOutUp");
          affixElement.removeClass("hidden");        
          affixElement.addClass("slideInDown");
        } else {
          affixElement.removeClass("slideInDown");
          affixElement.addClass("slideOutUp");
        } 


    });


}());
