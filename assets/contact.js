var common = require("./common");
var viewUtils = require('../utils/ViewUtils');

common.then(function(){

  var $ = window.jQuery;

  require(['jquery.validate', './vendor/jquery.validate.de'], function(){
    
    // Order submit form
    $('#order-submit-form').submit(function(e){
      e.preventDefault();
    }).validate({
      rules: {
        'phone': {
          phoneCH: true,
          required: true
        }
      },
      lang: 'de'
    });


    // Contact form
    $("#contact-form").submit(function(e){
      e.preventDefault();
    }).validate({
      rules: {
        "phone": {
          phoneCH: true,
          required: true
        }
      },
      lang: 'de',
      submitHandler: function(form){

        var submit_btn = $(form).find(':submit'); // Create button handler
        submit_btn.addClass('disabled loading'); // Disable and add loading class
        $(form).find('.ui.message').hide(); // Hide previous messages

        $.post({
          url: "/contact/form",
          data: $(form).serialize(),
          success: function(data, textStatus, xhr){
            // Reactivate button
            submit_btn.removeClass('disabled loading');
            // Clear form
            $(form).find("input[type=text], textarea").val("");

            var msg = $('.ui.message');

            if(xhr.status != 200){
              if(data && data.message){
                viewUtils.showErrorMessage(data.message, form);
              }
            }else{
              // Success
              var successModal = viewUtils.miniModal("Besten Dank!", "\
                <p>Wir haben Ihre Nachricht erhalten und melden uns bald bei Ihnen.</p> \
                <p>Herzlich,</p><p>Familie Imhof</p>");
              $(successModal).modal('show');

            }
          },
          error: function(xhr, status, err){
            // Reactivate button
            submit_btn.removeClass('disabled loading');
            viewUtils.showErrorMessage(xhr.responseJSON.message, form);
          }
        });
      }
    });

    // Load google map
    var map;

    window.initMap = function() {

      console.log("Received Google API callback.");

      var myPosition = {lat: 47.4677823, lng: 7.8182684};

      map = new google.maps.Map(document.getElementById('map'), {
        center: myPosition,
        zoom: 10,
        scrollwheel: false
      });

      var marker = new google.maps.Marker({
        position: myPosition,
        map: map,
        title: 'Imhof Weine, 4450 Sissach'
      });

      marker.setMap(map);

      // Specify features and elements to define styles.
      var styles = 
        [{"featureType":"landscape","stylers":[{"hue":"#FFA800"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#53FF00"},{"saturation":-73},{"lightness":40},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FBFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#00FFFD"},{"saturation":0},{"lightness":30},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00BFFF"},{"saturation":6},{"lightness":8},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#679714"},{"saturation":33.4},{"lightness":-25.4},{"gamma":1}]}]
      ;
      map.setOptions({styles: styles});
    }


    $('#map').addClass('scrolloff'); // set the pointer events to none on doc ready

    $('.map-row').click(function () {
      $('#map').removeClass('scrolloff'); // set the pointer events true on click
    });

    $(".map-row").mouseleave(function () {
      $('#map').addClass('scrolloff'); // set the pointer events to none when mouse leaves the map area
    });

    function loadGoogleMaps(){
      var script_tag = document.createElement('script');
      script_tag.setAttribute("type","text/javascript");
      script_tag.setAttribute("src","https://maps.googleapis.com/maps/api/js?key=AIzaSyDcwNj_KunZQmdP64H7TlURafnF66uS3vI&callback=initMap");
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }

    loadGoogleMaps();
  });
});
