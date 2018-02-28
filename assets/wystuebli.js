var common = require("./common");
var utils = require('./utils');
var viewUtils = require('../utils/ViewUtils');

require('./less/shop.less');

common.then(function(){

  $('.jump-to-wystuebli-start').click(function(){
    utils.jumpTo($('#wystuebli-start').offset());
  });

  require(['jquery.validate', './vendor/jquery.validate.de'], function(){
    $("#wystuebli-form").submit(function(e){
      e.preventDefault();
    }).validate({
      lang: 'de',
      rules: {
        phoneOrEmail:{
          required: true,
          phoneOrEmail: true
        },
      },
      submitHandler: function(form, event) {

        var submit_btn = $(form).find(':submit'); // Create button handler
        submit_btn.addClass('disabled loading'); // Disable and add loading class
        $(form).find('.ui.message').hide(); // Hide previous messages

        $.post({
          url:"/contact/form", 
          data: $(form).serialize()
        }).done(function(data, textStatus, xhr){
          // Reactivate button
          submit_btn.removeClass('disabled loading');

          // Clear form
          $(form).find("input[type=text], textarea").val("");

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
        }).fail(function(xhr, status, err){
          // Reactivate button
          submit_btn.removeClass('disabled loading');
          viewUtils.showErrorMessage(xhr.responseJSON.message, form);
        });
      }
    });
  });
});

