var common = require('../common.js');

common.then(function(){
      require(['jquery'], function($){
        require(['jquery.validate'], function(){
          $('form#modify-event').validate({
            rules: {
              // at least 15€ when bonus material is included
              begin: {
                required: true,
                date: true
              },
              end: {
                required: true,
                date: true
              }
            }
          });
          
          $('form#modify-product').validate({
            rules: {
              // at least 15€ when bonus material is included
              price: {
                required: true,
                number: true
              },
              title : {
                required: true
              }
            }
          });

        });
        
        if($('#visible').val() == "true"){
          $('#visible-checkbox').checkbox('check');
        }

        // Set selected for single selection dropdown
        $('#product-type-dropdown > .ui.dropdown').dropdown({
          allowAdditions: true,
          onChange: function(value, text, choice){
            if(choice.hasClass('addition')){
              $('#product-type-is-addition').val('true');
            }else{
              $('#product-type-is-addition').val('false');
            }
          }
        });

        if($('#product-type').val()){
          $('#product-type-dropdown > .ui.dropdown').dropdown('set selected', $('#product-type').val());
        }


        $('.remove-product').click(function(){
          var el = this;
          var id = $(el).data('id');
          if(confirm("Sind Sie sicher, dass Sie dieses Produkt löschen möchten?")){
            $.post({
              url: '/admin/products/delete',
              data: { id: id }
            }).done(function(res){
              $(el).closest('tr').remove();
            }).fail(function(xhr, status, err){
              console.log(err);
            });
          }
        });
      });
    }
)