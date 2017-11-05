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
} );
// Add Swiss phone number rule
var validator = function(phone_number, element){
  phone_number = phone_number.replace(/\s+/g, "");
  return this.optional(element) 
    || phone_number.length > 9 
    && phone_number.match(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
}

$.validator.addMethod("phoneCH", validator , "Bitte geben Sie eine gültige Telefonnummer ein!");

}));
