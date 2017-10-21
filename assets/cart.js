var common = require('./common');

common.then(function(){

  var Cookies = require('cookies');
  var $ = require('jquery');
  var glob = require('./globals');

  var itemsToBuy = Cookies.getJSON('itemsToBuy') || []

  // Increase decrease
  $('button.add').on('click', function(e){
    var id = $(this).data('id');
    el = $('#amount-' + id);
    var amount = glob.getIncrement(el.val());
    el.val(amount);
    amountChanged(id, amount);
  });
  $('button.subtract').on('click', function(e){
    var id = $(this).data('id');
    el = $('#amount-' + id);
    var amount = glob.getDecrement(el.val());
    el.val(amount);
    amountChanged(id, amount);
  });

  $('.item-quantity').on('keyup', function(){
    var id = $(this).data('id');
    var amount = $(this).val();
    amountChanged(id, amount);
  });

  var emptyCart = function(){
    if (Cookies.getJSON('itemsToBuy') != undefined) {
      Cookies.remove('itemsToBuy');
    }       

    window.location.replace("/shop/cart");
  }

  // Empty cart
  $('#deleteCart').click(emptyCart);
  
  
  var path = require('path');


  // Update item in cookie

  // Function to return item from cookie where html_id == obj
  function _findWhereId(arr, obj) {
    for(var i=0; i<arr.length; i++) {
      if (arr[i].html_id == obj) return arr[i];
    }
  }

  // Get total price
  function getTotalPrice(){
    var total = 0;
    $('.item-row').each(function(){
      total += parseInt($(this).find('#subtotal-'+$(this).data('id')).text());
    });
    return (parseFloat(total) / 100).toFixed(2);
  }


  var updateTotalPrice = function(){
    $('#totalPrice .value').text("Total (CHF): " + getTotalPrice());
  }

  function amountChanged(id, amount){
    // Update cookie
    items = Cookies.getJSON('itemsToBuy') || [];
    var index = items.findIndex(function(obj){
      return obj._id == id
    });

    items[index].itemsAmount = amount;
    Cookies.set('itemsToBuy', items, {expires: 15});

    // Calculate subtotal
    
    var price = parseFloat($('#price-'+id).text());
    console.log("price: " + price);

    var amount = parseInt($('#amount-'+id).val());
    console.log("Amount: " + amount);

    $('#subtotal-'+id).text(price * amount);
   
    updateTotalPrice();
  }


  function deleteItem(id) {

    $('.ui.modal.delete').modal({
      onApprove : function(){

        var items = Cookies.getJSON('itemsToBuy');

        for(var i=0; i<items.length; i++) {
          if (items[i].html_id == id){
            console.log("found matching item.");				
            $('#details-' + items[i].html_id).css('display', 'none');

            // Remove item from array
            items.splice(i, 1);

            // Update cookie
            Cookies.set('itemsToBuy', items, {expires: 15});

            updateTotalPrice();
          } 
        }

        refreshActionButtons();
      }
    }).modal('show');

  }
  function refreshActionButtons(){
    var items = Cookies.getJSON('itemsToBuy') || new Array();

    if(items.length < 1){
      $('.actions').html('<p class="alert" style="font-size:1rem;">Ihr Warenkorb ist leer. Bitte begeben Sie sich in den <a href="/shop" class="link">Imhof\'s Shop</a>, um unsere Produkte kaufen zu können.</p>')
    }
  }


  // Initialize
  updateTotalPrice();
  refreshActionButtons();
});
