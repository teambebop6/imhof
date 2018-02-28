exports.getCHF = function(priceInCents){
  return (parseFloat(priceInCents) / 100).toFixed(2);
}

exports.formatPrice = function(price){
  return parseFloat(price).toFixed(2);
}

exports.showMessage = function(res){
  if(!res.status || res.status == 200){
    $('.ui.message').removeClass('error');
    $('.ui.message').addClass('success');
    $('.ui.message .message').text(res.message);
    $('.ui.message').show();
  }
  else{
    $('.ui.message').removeClass('success');
    $('.ui.message').addClass('error');
    $('.ui.message .message').text(res.message);
    $('.ui.message').show();
  }
}

exports.showErrorMessage = function(message, formElement){
  if(formElement){
    var el = $('<div class="ui error message"></div>');
    el.html(message);
    el.prependTo($(formElement));
    el.show();
  }
  else{
    $('.ui.message').removeClass('success');
    $('.ui.message').addClass('error');
    $('.ui.message .message').text(message);
    $('.ui.message').show();
  }
}

// Success modal
var miniModal = function(title, message){
  return '<div class="ui mini modal"> \
  <i class="close icon"></i> \
  <div class="header"> \
    '+title+' \
  </div> \
  <div class="content"> \
    '+message+' \
  </div> \
</div>';

}
exports.miniModal = miniModal;

