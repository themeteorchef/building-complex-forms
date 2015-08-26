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
        isProfile = template.data.context === "profile";

    if ( !isProfile ) {
      $( panel ).addClass( 'selected' );
      $( '.panel' ).not( panel ).removeClass( 'selected' );
    }
  }
});
