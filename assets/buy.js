var common = require('./common');
var viewUtils = require('../utils/ViewUtils');

common.then(function(){
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
      lang: 'de',
      submitHandler: function(form){
        $('#order-submit-form button[type="submit"]').addClass('disabled loading');

        $.post({url:"/shop/order", data: $(form).serialize()}).then(function(res){
          $('#order-submit-form button[type="submit"]').removeClass('disabled loading');
          
          if(res.status != 200){
             viewUtils.showMessage(res);
          }else{
            // Success
            $('.mini.modal.orderConfirm').modal({
              onHidden: function(){
                window.location.replace("/");
              } 
            }).modal('show');
          }
        }).fail(function(xhr, status, err){
          $('#order-submit-form button[type="submit"]').removeClass('disabled loading');
          viewUtils.showMessage(err);
        })
      }
    });
  });

  function showAgbs(){
    $.get({url:"/agb"}).then(function(data){
      $(".ui.modal.agb .content").html($(data).find('#inner-content .ui.grid > .column').html());
      $(".ui.modal.agb .content").find('h2').remove();
      $(".ui.modal.agb .content").find('h3:first').css('margin-top', '0');
      $(".ui.modal.agb").find("#inner-content").css('padding', '1rem');
      $('.ui.modal.agb').modal({
        onDeny	: function(){},
        onApprove : function(){
          $('#agreeToTerms').prop('checked', true);
          $("#imhofForm :submit").removeClass("disabled");
        }
      }).modal('show');
    }).fail(function(xhr, status, err){
      console.log(err);
    });
  }
  $("#agreeToTerms").change(function(){
    if(this.checked){
      $("#imhofForm :submit").removeClass("disabled");
    }else{
      $("#imhofForm :submit").addClass("disabled");
    }
  });
});
