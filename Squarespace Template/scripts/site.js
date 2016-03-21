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
          template: '<div class="instagram-photo"><a href="{{link}}"><img src="{{image}}" /></a></div>'
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
            //stuff to do on mouse enter
            $(this).find("h3").removeClass('animated fadeIn');
            $(this).find(".role").removeClass('animated fadeIn');
            $(this).find(".twitter-handle").removeClass('animated fadeOut');

            $(this).find("h3").addClass('animated fadeOut');
            $(this).find(".role").addClass('animated fadeOut');
            $(this).find(".twitter-handle").addClass('animated fadeIn');
        },
        mouseleave: function () {
            //stuff to do on mouse leave

            $(this).find("h3").removeClass('animated fadeOut');
            $(this).find(".role").removeClass('animated fadeOut');
            $(this).find(".twitter-handle").removeClass('animated fadeIn');

            $(this).find("h3").addClass('animated fadeIn');
            $(this).find(".role").addClass('animated fadeIn');
            $(this).find(".twitter-handle").addClass('animated fadeOut');
        }
    });

    // =========================================
    // load the isotop grid for the blog
    // =========================================
    $(window).bind("load", function() {

        // init Isotope
        var $container = $('.grid').isotope({
            itemSelector: '.grid-item',
            // set layoutMode
            layoutMode: 'packery',
            packery: {
                gutter: 0
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
            $container.isotope({ filter: filterValue });
        });

    });
    

}());
