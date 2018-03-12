var common = require('../common.js');

common.then(function (){
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

  require('../vendor/jquery.picker/picker.min.css');
  require(['../vendor/jquery.picker/picker.min.js'], function () {

    console.log("Jquery picker loaded.");
    var coeff = 1000 * 60 * 5;


    $('#soldOut-checkbox').checkbox({
      onChecked: function () { $('#expectedRefillDate').show(); },
      onUnchecked: function () { $('#expectedRefillDate').hide(); }
    })

    $('.js-month-picker').each(function (index, e) {
      const pickr = new Picker(e, {
        format: "MMMM YYYY",
        date: new Date(Math.ceil((new Date()).getTime() / coeff) * coeff),
        months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        increment: {
          minute: 5,
        }, translate(type, text) {
          const suffixes = {
            year: '',
            month: '',
            day: '.',
            hour: '',
            minute: '',
          };

          return text + suffixes[type];
        },
        text: {
          title: 'Bitte wählen Sie ein Datum aus',
          cancel: 'Abbrechen',
          confirm: 'Bestätigen',
        },
      });
      var d = new Date($(e).val());
      if (Object.prototype.toString.call(d) === "[object Date]") {
        if (!isNaN(d.getTime())) {
          pickr.setDate(d);
          pickr.pick();
        }
      }
    });
  });
});
