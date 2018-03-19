module.exports = function(e, format, title){ 
  var coeff = 1000 * 60 * 5;

  var pickr = new Picker(e, {
    format: format,
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
      title: title || 'Bitte wählen sie ein Datum aus',
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

  return pickr;
}
