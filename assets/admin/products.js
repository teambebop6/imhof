var common = require('../common.js');
var Pckr = require('../components/DatePicker');

common.then(function (){

  // Visibility checkbox
  
  if ($('#visible').val() == "true") {
    $('#visible-checkbox').checkbox('check');
  }

  var switchProductVisibleCheckbox = function (productId, checked) {
    $.post({
      url: '/admin/products/visible/',
      data: {
        id: productId,
        visible: checked
      }
    }).done(function (res) {
    }).fail(function (xhr, status, err) {
      console.log(err);
    });
  };

  $('.product_visible_checkbox').checkbox({
    onChecked: function (ele) {
      switchProductVisibleCheckbox($(this).data('id'), true)
    },
    onUnchecked: function (ele) {
      switchProductVisibleCheckbox($(this).data('id'), false)
    }
  });

  // Form Validation
  require(['jquery.validate', 'jquery.validate.de'], function () {
    $('form#modify-product').validate({
      rules: {
        price: {
          required: true,
          price: true
        },
        title: {
          required: true
        }
      }
    });
  });

  // Set selected for single selection dropdown
  $('#product-type-dropdown > .ui.dropdown').dropdown({
    allowAdditions: true,
    onChange: function (value, text, choice) {
      if (choice.hasClass('addition')) {
        $('#product-type-is-addition').val('true');
      } else {
        $('#product-type-is-addition').val('false');
      }
    }
  });

  if ($('#product-type').val()) {
    $('#product-type-dropdown > .ui.dropdown').dropdown('set selected', $('#product-type').val());
  }
  if ($('#soldOut').val() && $('#soldOut').val() == "true") {
    $('#soldOut-checkbox').checkbox('set checked');
  }


  $('.remove-product').click(function () {
    var el = this;
    var id = $(el).data('id');
    if (confirm("Sind Sie sicher, dass Sie dieses Produkt löschen möchten?")) {
      $.post({
        url: '/admin/products/delete',
        data: {id: id}
      }).done(function (res) {
        $(el).closest('tr').remove();
      }).fail(function (xhr, status, err) {
        console.log(err);
      });
    }
  });

  $('#soldOut-checkbox').checkbox({
    onChecked: function () { $('#expectedRefillDate').show(); },
    onUnchecked: function () { $('#expectedRefillDate').hide(); }
  })

  require(['../vendor/jquery.picker/picker.min.js'], function () {
    $('.js-month-picker').each(function (index, e) {
      const pickr = new Pckr(e, "MMMM YYYY", "Bitte wählen Sie Monat und Jahr.");
    });
  });
});
