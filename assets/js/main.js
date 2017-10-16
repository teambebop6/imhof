require(['jquery', './js.cookie.js'], function($, Cookies){
    
  function toggleNav(selected){
    if(selected){
      $('.return-home').delay('1000').fadeIn(1500);
      $('html').animate({ marginTop: - $('.logo-row').outerHeight() }, 300);
      if(!$('.logo').hasClass('nav-selected')) $('.logo').toggleClass('nav-selected');
      if(!$('.nav').hasClass('nav-selected')) $('.nav').toggleClass('nav-selected');

    }else{
      // Return to home
      $('html').animate({ marginTop: 0 }, 300);
      $('.logo').removeClass('nav-selected');
      $('.nav').removeClass('nav-selected');
      $('.return-home').fadeOut(200);
      $('#inner-content').html("");	// Empty inner content
    }
  }

  // Sidebar
  $('.toggle-sidebar').click(function(){
    $('.ui.sidebar').sidebar('toggle');
  });
  $('.ui.sidebar .item').click(function(){
    $('.ui.sidebar').sidebar('toggle');
  });
  $('.toggle-sidebar').click(function(){
    $('.ui.sidebar').sidebar('toggle');
  });

  // Cart
  var itemsToBuy = Cookies.getJSON('itemsToBuy');

  if (itemsToBuy !== undefined && itemsToBuy.length > 0 ) {
    console.log("Gots items in the cart...");

    // Update number of items in cart
    $('.number-of-items-in-cart').html('<span>' + itemsToBuy.length + '</span>');
  }


  $.fn.rotate = function(angle,whence) {
    var p = this.get(0);

    // we store the angle inside the image tag for persistence
    if (!whence) {
      p.angle = ((p.angle==undefined?0:p.angle) + angle) % 360;
    } else {
      p.angle = angle;
    }

    if (p.angle >= 0) {
      var rotation = Math.PI * p.angle / 180;
    } else {
      var rotation = Math.PI * (360+p.angle) / 180;
    }
    var costheta = Math.cos(rotation);
    var sintheta = Math.sin(rotation);

    if (document.all && !window.opera) {
      var canvas = document.createElement('img');

      canvas.src = p.src;
      canvas.height = p.height;
      canvas.width = p.width;

      canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+costheta+",M12="+(-sintheta)+",M21="+sintheta+",M22="+costheta+",SizingMethod='auto expand')";
    } else {
      var canvas = document.createElement('canvas');
      if (!p.oImage) {
        canvas.oImage = new Image();
        canvas.oImage.src = p.src;
      } else {
        canvas.oImage = p.oImage;
      }

      canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width) + Math.abs(sintheta*canvas.oImage.height);
      canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height) + Math.abs(sintheta*canvas.oImage.width);

      var context = canvas.getContext('2d');
      context.save();
      if (rotation <= Math.PI/2) {
        context.translate(sintheta*canvas.oImage.height,0);
      } else if (rotation <= Math.PI) {
        context.translate(canvas.width,-costheta*canvas.oImage.height);
      } else if (rotation <= 1.5*Math.PI) {
        context.translate(-costheta*canvas.oImage.width,canvas.height);
      } else {
        context.translate(0,-sintheta*canvas.oImage.width);
      }
      context.rotate(rotation);

    }
  }

});

