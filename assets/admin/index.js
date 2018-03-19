var common = require('../common.js');

common.then(function () {
  require(['jquery.validate', 'jquery.validate.de'], function () {
    $('form#modify-citation').validate({
      rules: {
        words: {
          required: true,
        },
        author: {
          required: true,
        },
      }
    });

    $('form#modify-showcase').validate({
      rules: {
        title: {
          required: true,
        },
        detail: {
          required: true
        }
      }
    });
  });

  if ($('#showcase-visible').val() == "true") {
    $('#showcase-visible-checkbox').checkbox('check');
  }

  $('.remove-showcase').click(function () {
    var el = this;
    var id = $(el).data('id');
    if (confirm("Sind Sie sicher, dass Sie dieses Schaukasten löschen möchten?")) {
      $.post({
        url: '/admin/showcases/delete',
        data: {id: id}
      }).done(function (res) {
        $(el).closest('tr').remove();
      }).fail(function (xhr, status, err) {
        console.log(err);
      });
    }
  });

  var switchShowcaseVisibleCheckbox = function (showcaseId, checked) {
    $.post({
      url: '/admin/showcases/visible/',
      data: {
        id: showcaseId,
        visible: checked
      }
    }).done(function (res) {
    }).fail(function (xhr, status, err) {
      console.log(err);
    });
  };

  $('.visible_checkbox').checkbox({
    onChecked: function (ele) {
      switchShowcaseVisibleCheckbox($(this).data('id'), true)
    },
    onUnchecked: function (ele) {
      switchShowcaseVisibleCheckbox($(this).data('id'), false)
    }
  });

  var switchCitationVisibleCheckbox = function (citationId, checked) {
    $.post({
      url: '/admin/citations/visible/',
      data: {
        id: citationId,
        visible: checked
      }
    }).done(function (res) {
    }).fail(function (xhr, status, err) {
      console.log(err);
    });
  };

  $('.citation_visible_checkbox').checkbox({
    onChecked: function (ele) {
      switchCitationVisibleCheckbox($(this).data('id'), true)
    },
    onUnchecked: function (ele) {
      switchCitationVisibleCheckbox($(this).data('id'), false)
    }
  });

  require('../vendor/jquery.picker/picker.min.css');
  require(['../vendor/jquery.picker/picker.min.js'], function () {

    console.log("Jquery picker loaded.");
    var coeff = 1000 * 60 * 5;

    $('.js-full-picker').each(function (index, e) {
      const pickr = new Picker(e, {
        format: "D. MMMM YYYY, HH:mm",
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
          title: 'Bitte wählen Sie ein Datum und eine Uhrzeit aus',
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
