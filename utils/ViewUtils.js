exports.getCHF = function(priceInCents){
  return (parseFloat(priceInCents) / 100).toFixed(2);
}

exports.formatPrice = function(price){
  return parseFloat(price).toFixed(2);
}

exports.showMessage = function(res){
  if(res.status == 200){
    $('.ui.message').removeClass('error');
    $('.ui.message').addClass('success');
    $('.ui.message .message').text(res.message);
    $('.ui.message').show();
  }
  else if(res.status == 400){
    $('.ui.message').removeClass('success');
    $('.ui.message').addClass('error');
    $('.ui.message .message').text(res.message);
    $('.ui.message').show();
  }
}
