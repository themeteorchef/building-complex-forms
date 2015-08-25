Template.order.onCreated( function() {
  this.subscribe( 'order' );

  this.currentOrder = new ReactiveDict();

  this.currentOrder.set({
    "type": "My Pizzas",
    "pizza": { "name": "Pick a pizza!", "price": 0 }
  });

});

Template.order.helpers({
  customer: function() {

    if ( Meteor.userId() ) {
      var getCustomer = Customers.findOne( { "userId": Meteor.userId() } );
    } else {
      var getCustomer = {};
    }

    if ( getCustomer ) {
      getCustomer.context = "order";
      return getCustomer;
    }
  },
  order: function() {
    var currentOrder = Template.instance().currentOrder,
        type         = currentOrder.get( "type" ),
        pizza        = currentOrder.get( "pizza" ),
        price        = currentOrder.get( "price");

    if ( type !== "Custom Pizza" ) {
      var getPizza = pizza.name !== "Pick a pizza!" ? Pizza.findOne( { "_id": pizza } ) : pizza;
    } else {
      var getPizza = {
        name: "Custom Name",
        price: 10000
      }
    }

    if ( getPizza ) {
      return {
        type: pizza.name !== "Pick a pizza!" ? type : null,
        pizza: getPizza,
        price: getPizza.price
      }
    }
  }
});

Template.order.events({
  'click .nav-tabs li': function( event, template ) {
    var orderType = $( event.target ).closest( "li" ).data( "pizza-type" );

    template.currentOrder.set( "type", orderType );
    template.currentOrder.set( "pizza", { "name": "Pick a pizza!", "price": 0 } );
  },
  'click .pizza': function( event, template ) {
    template.currentOrder.set( "pizza", this._id );
  }
});
