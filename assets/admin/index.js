var common = require('../common.js');

common.then(function () {
  require(['jquery'], function ($) {
    require(['jquery.validate', 'jquery.validate.de'], function () {

      jQuery.validator.addMethod("price", function (value, element) {
        return this.optional(element) || /^(\d+|\d+.\d{1,2})$/.test(value);
      }, "Bitte eine zweistellige Kommazahl eingeben");

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

    if ($('#visible').val() == "true") {
      $('#visible-checkbox').checkbox('check');
    }

    if ($('#showcase-visible').val() == "true") {
      $('#showcase-visible-checkbox').checkbox('check');
    }

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

    if ($('#visible').val() == "true") {
      $('#visible-checkbox').checkbox('check');
    }

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
      $('.js-full-picker').each(function (index, e) {
        const pickr = new Picker(e, {
          format: "D. MMMM YYYY, HH:mm",
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
});
