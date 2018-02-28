(function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( ["jquery", "jquery.validate"], factory );
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory( require( "jquery" ) );
  } else {
    factory( jQuery );
  }
}(function( $ ) {
  /*
   * Translated default messages for the jQuery validation plugin.
   * Locale: DE (German, Deutsch)
   */
  $.extend( $.validator.messages, {
    required: "Dieses Feld ist ein Pflichtfeld.",
    maxlength: $.validator.format( "Geben Sie bitte maximal {0} Zeichen ein." ),
    minlength: $.validator.format( "Geben Sie bitte mindestens {0} Zeichen ein." ),
    rangelength: $.validator.format( "Geben Sie bitte mindestens {0} und maximal {1} Zeichen ein." ),
    email: "Geben Sie bitte eine gültige E-Mail Adresse ein.",
    url: "Geben Sie bitte eine gültige URL ein.",
    date: "Bitte geben Sie ein gültiges Datum ein.",
    number: "Geben Sie bitte eine Nummer ein.",
    digits: "Geben Sie bitte nur Ziffern ein.",
    equalTo: "Bitte denselben Wert wiederholen.",
    range: $.validator.format( "Geben Sie bitte einen Wert zwischen {0} und {1} ein." ),
    max: $.validator.format( "Geben Sie bitte einen Wert kleiner oder gleich {0} ein." ),
    min: $.validator.format( "Geben Sie bitte einen Wert größer oder gleich {0} ein." ),
    creditcard: "Geben Sie bitte eine gültige Kreditkarten-Nummer ein."
  } 
  );

  var isSwissPhoneNumber = function(number){
    number = number.replace(/\s+/g, "");
    return number.length > 9 && number.match(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
  }

  // Add Swiss phone number rule
  var phoneValidator = function(phone_number, element){
    return this.optional(element) || isSwissPhoneNumber(phone_number)
  }

  $.validator.addMethod("phoneCH", phoneValidator , "Bitte geben Sie eine gültige Telefonnummer ein!");


  var phoneOrEmailValidator = function(value, element){
    return this.optional(element) 
      || isSwissPhoneNumber(value) 
      || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
  }
  
  $.validator.addMethod("phoneOrEmail", phoneOrEmailValidator, "Bitte geben Sie eine gültige Telefonnummer oder eine gültige Email-Adresse ein!");
}));
