var common = require('../common.js');

common.then(function(){
      require(['jquery'], function($){
        require(['jquery.validate'], function(){
          jQuery.validator.addMethod("price", function (value, element) {
              return this.optional(element) || /^(\d+|\d+.\d{1,2})$/.test(value);
          }, "Bitte eine zweistellige Kommazahl eingeben");
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
                price: true
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

        $('.remove-event').click(function(){
          var el = this;
          var id = $(el).data('id');
          if(confirm("Sind Sie sicher, dass Sie dieses Event löschen möchten?")){
            $.post({
              url: '/admin/events/delete',
              data: { id: id }
            }).done(function(res){
              $(el).closest('tr').remove();
            }).fail(function(xhr, status, err){
              console.log(err);
            });
          }
        });


        require(['jquery.inputmask'], function(){
          $(function() {
            $(":input").inputmask();
          })
        })

      });
    }
)
