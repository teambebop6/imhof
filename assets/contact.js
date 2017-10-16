var common = require("./common");

common.then(function(){

  var $ = window.jQuery;

  require(['jquery.validate', './vendor/jquery.validate.de'], function(){
    // Add Swiss phone number rule
    var validator = function(phone_number, element){
      phone_number = phone_number.replace(/\s+/g, "");
      return this.optional(element) 
        || phone_number.length > 9 
        && phone_number.match(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
    }

    $.validator.addMethod("phoneCH", validator , "Bitte geben Sie eine gültige Telefonnummer ein!");

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
      submitHandler: function(){

        $('#submit-form').addClass('loading');
        $('#submit-form').prop('disabled', true); 

        $.ajax({
          url: "/contact/form",
          method: "POST",
          data: $('#contact-form').serialize(),
          success: function(result){
            if(result.success){
              $('#contact-form')[0].reset();
              $('#contact-form .field').hide();
              $('#contact-form button').hide();
              $('.error.message').hide();

              $('.success.message > .message').html(result.message);
              $('.success.message').show();
            }else{
              $('.error.message > .message').html(result.message);
              $('.error.message').show();
              $('.success.message').hide();

            }

            $('#submit-form').removeClass('loading');
            $('#submit-form').prop('disabled', false);  
          },
          error: function(err){
            $('.error.message > .message').html(err);
            $('.error.message').show();
            $('.success.message').hide();

            $('#submit-form').removeClass('loading');
            $('#submit-form').prop('disabled', false);  
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
