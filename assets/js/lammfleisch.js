require(['jquery', 'jquery.validate'], function($){
  $("#commentForm").validate({
    lang: 'de',
    submitHandler: function(form, event) {
      
      $('#send-preorder').addClass('loading');
      $('#send-preorder').prop('disabled', true);	
      
      $.ajax({
        url: "/shop/preorder",
        method: "POST",
        data: $( "#commentForm" ).serialize(),
        success: function(result){
          if(result.success){
            $('.success.message').show();		
            $('.error.message').hide();
            
            $('#commentForm .field').hide();

          }else{
            $('.error-message').html(result.message);
            $('.error.message').show();
            $('.success.message').hide();
            $('#send-preorder').removeClass('loading');
            $('#send-preorder').prop('disabled', false);	
          }
        },
        error: function(err){
          $('error-message').html(err);
          $('.error.message').show();
          $('.success.message').hide();
          $('#send-preorder').removeClass('loading');
          $('#send-preorder').prop('disabled', false);	
        }
      });
    }
  });
});
