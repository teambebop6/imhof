var common = require('../common.js');

common.then(function (){
  require(['jquery.validate', 'jquery.validate.de'], function () {
    $('form#modify-event').validate({
      rules: {
        name: {
          required: true,
        },
        begin: {
          required: true,
        },
        end: {
          required: true,
        },
      }
    });
  });

  $('.remove-event').click(function () {
    var el = this;
    var id = $(el).data('id');
    if (confirm("Sind Sie sicher, dass Sie dieses Event löschen möchten?")) {
      $.post({
        url: '/admin/events/delete',
        data: {id: id}
      }).done(function (res) {
        $(el).closest('tr').remove();
      }).fail(function (xhr, status, err) {
        console.log(err);
      });
    }
  });

  const DatePicker = require('../components/DatePicker');
  require(['../vendor/jquery.picker/picker.min.js'], function () {
    $('.js-full-picker').each(function (index, e) {
      const pickr = new DatePicker(e, "D. MMMM YYYY, HH:mm", "Bitte wählen Sie Datum und Uhrzeit.");
    });
  });
});
