Template.pizza.helpers({
  isProfile: function() {
    return Template.instance().data.context === "profile" ? true : false;
  },
  pizza: function() {
    return Template.instance().data.pizza;
  }
});


Template.pizza.events({
  'click .panel': function( event, template ) {
    var panel     = template.firstNode,
        checkbox  = "input[type='checkbox']",
        isProfile = template.data.context === "profile";

    if ( !isProfile ) {
      $( panel ).addClass( 'selected' ).find( checkbox ).prop( "checked", true );
      $( '.panel' ).not( panel ).removeClass( 'selected' ).find( checkbox ).prop( "checked", false );
    }
  }
});
