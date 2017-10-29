var common = require("./common");

require('./less/shop.less');

common.then(function(){
  var Cookies = require('cookies');
  
  // Load cart items
  var itemsToBuy = [];
  if (Cookies.getJSON('itemsToBuy') === undefined) {
    Cookies.set('itemsToBuy', [], {expires: 15});
  } else {
    itemsToBuy = Cookies.getJSON('itemsToBuy');
  }

  // Items opacity
  $('.shop-item').on('mouseover', function(){
    $('.item-image').not($(this).find('.item-image')).css('opacity', '0.2');
    $(this).find('.item-title').show();
  });
  $('.shop-item').on('mouseleave', function(){
    $('.item-image').not($(this).find('.item-image')).css('opacity', '');
    $(this).find('.item-title').hide();
  });


  // Item cart
  $('form.buy-item').submit(function(e){
    e.preventDefault();
  });

  $('form.buy-item .to-cart').click(function(e){
    buyItem(false, $(this).data('id')); 
  });

  $('.form.buy-item .insta-buy').click(function(){
    buyItem(true, $(this).attr('id')); 
  });


  // Function to return item from cookie where html_id == obj
  function _findWhereId(arr, obj) {
    for(var i=0; i<arr.length; i++) {
      if (arr[i].html_id == obj) return arr[i];
    }
    return undefined;
  }

  // Perform add to cart or buy now
  function buyItem(buyNow, id) {

    var items = Cookies.getJSON('itemsToBuy');

    // Get quantity
    var quantity = parseInt($('#amount-'+id).val());
    if(!quantity || quantity < 1){ quantity = 1; }


    var index;
    // Check if items is array
    if( Object.prototype.toString.call( items ) === '[object Array]' ) {

      // Find index of
      index = items.findIndex(function(obj) {
        return obj._id == id;
      });

      if(index < 0){
        items.push({
          _id: id,
          itemsAmount: quantity
        });
        index = items.length - 1;
      }else{
        items[index].itemsAmount += quantity
      }

    }else{
      items = [
      {
        _id: id,
        itemsAmount: quantity
      }
      ];
      index = 0;
    }

    Cookies.set('itemsToBuy', items, {expires: 15});

    $('.number-of-items-in-cart').html('<span>' + items.length + '</span>');

    // Cart icon animation 
    if($('.cart-out').css('display') == 'none'){
      $('.cart-in').transition({
        animation : 'tada',
        duration: 800
      });
      $('.cart-in').transition({
        animation : 'flash',
        duration: 400
      });
    }else{
      $('.cart-out').transition({
        animation : 'tada',
        duration: 800
      });
      $('.cart-out').transition({
        animation : 'flash',
        duration: 400
      });
    }

    if(buyNow) {
      window.open('/shop/buy');    // Open buy.html page in a new tab.
    }
  }


  // jump to section
  var jumpTo = function(offset){
    console.log(offset);
    $('html, body').animate({
      scrollTop: offset.top - $('.page-nav').height() - $('.subnav-grid').height()
    }, 1500, 'swing');
  }

  $('#link-storchenaschtler').click(function(){
    if($(window).width() <= 992){	
      $('.subnav').toggle();
      refreshSubnav();
    }
    jumpTo($('#anchor-storchenaschtler').offset());
  });
  $('#link-edelbrande').click(function(){
    if($(window).width() <= 992){	
      $('.subnav').toggle();
      refreshSubnav();
    }
    jumpTo($('#anchor-brandy').offset());
  });
  $('#link-imhofs').click(function(){
    if($(window).width() <= 992){	
      $('.subnav').toggle();
      refreshSubnav();
    }
    jumpTo($('#anchor-imhof_wine').offset());
  });

  $('#link-lammfleisch').click(function(){

    // Load content
    $.ajax({
      url: "/shop/lammfleisch",
      mehtod: "GET",
      success: function(result){
        $('.ui.modal.lammfleisch .description').html(result);


        $('.ui.modal.lammfleisch').modal('show');
      },
      error: function(err){
        console.log(err);
      }
    })

  });


  // Shipping info margin
  var setShippingInfoMargin = function(){
    $('.shipping-info').css("margin-top", ($('.subnav-grid').height()));
  }


  // Window resized
  var windowHasResized = function(){
    if($(window).width() > 992){
      $('#toggle-category').hide();
      $('.subnav').show();
      $('.category-selection').css("cursor", "default");
    } else{
      $('#toggle-category').show();
      $('.subnav').hide();
      $('.category-selection').css("cursor", "pointer");
    }

    setShippingInfoMargin();
    refreshSubnav();
  }

  $(window).resize(function() {
    if(this.resizeTO) {clearTimeout(this.resizeTO)};
    this.resizeTO = setTimeout(function() {  
      $(this).trigger('resizeEnd'); 
    }, 10);  
  });

  $(window).bind('resizeEnd', function() {
    windowHasResized();     
  });

  function refreshSubnav(){
    if($('.subnav').is(":visible")){
      $('#toggle-category').css('top', 'auto');
      $('#toggle-category').css('bottom', '0');
      $('#toggle-category').css('margin-top', '0px');
      $('#toggle-category').css('transform', 'rotate(180deg)');
      $('#toggle-category').css('-moz-transform', 'rotate(180deg)');
      $('#toggle-category').css('-webkit-transform', 'rotate(180deg)');
    }else{
      $('#toggle-category').css('top', '0');
      $('#toggle-category').css('bottom', 'auto');
      $('#toggle-category').css('margin-top', '-3px');
      $('#toggle-category').css('transform', 'none');
      $('#toggle-category').css('-moz-transform', 'none');
      $('#toggle-category').css('-webkit-transform', 'none');
    } 
  }

  // Toggle category
  $('.category-selection').click(function(){
    if($(window).width() <= 992){	
      $('.subnav').toggle();
      refreshSubnav();
    }
    setShippingInfoMargin();
  });

  $('#toggle-category').click(function(){
    $('.subnav').toggle();
    refreshSubnav();	
    setShippingInfoMargin();
  });

  // initial set
  windowHasResized();

  // Increase decrease
  $('button.add').on('click', function(e){
    var id = $(this).data('id');
    el = $('#amount-' + id);
    el.val(getIncrement(el.val()));
  });
  $('button.subtract').on('click', function(e){
    var id = $(this).data('id');
    el = $('#amount-' + id);
    el.val(getDecrement(el.val()));
  });

  function getIncrement(val, step = 1){
    return parseInt(val) + parseInt(step);
  }

  function getDecrement(val, step = 1){
    val = parseInt(val);
    step = parseInt(step);
    if(val - step > 0) {
      return val - step;
    }
    else{
      return 1;
    }
  }
});
