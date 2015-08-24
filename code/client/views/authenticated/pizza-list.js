Template.pizzaList.helpers({
  isProfile: function() {
    return Template.instance().data === "profile" ? true : false;
  },
  location: function() {
    return Template.instance().data;
  },
  pizzas: function() {
    // var getPizzas = Pizza.find( { "ownerId": Meteor.userId() } );
    var getPizzas = [ 'one', 'two', 'three' ];

    if ( getPizzas ) {
      return getPizzas;
    }
  }
});

Template.pizza.events({
  'click .panel': function( event, template ) {
    var panel     = template.firstNode,
        checkbox  = "input[type='checkbox']",
        isProfile = template.data === "profile";

    if ( !isProfile ) {
      $( panel ).addClass( 'selected' ).find( checkbox ).prop( "checked", true );
      $( '.panel' ).not( panel ).removeClass( 'selected' ).find( checkbox ).prop( "checked", false );
    }
  }
})
