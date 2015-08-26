/*
* UI Helpers
* Define UI helpers for common template functionality.
*/

/*
* Current Route
* Return an active class if the currentRoute session variable name
* (set in the appropriate file in /client/routes/) is equal to the name passed
* to the helper in the template.
*/

UI.registerHelper('currentRoute', function(route){
  return Session.equals('currentRoute', route) ? 'active' : '';
});

/*
* toCommaString
* Takes a string of comma separated values and adds spaces between values.
*/

UI.registerHelper( 'toCommaString', function( array ) {
  return array.join( ", " );
});

/*
* toUsd
* Takes a cents value, converts it to dollars, and prepends a $ symbol.
*/

UI.registerHelper( 'toUsd', function( value ) {
  return "$" + ( value / 100 );
});
