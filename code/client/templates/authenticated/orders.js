Template.orders.helpers({
  orders: function() {
    var getOrders = Orders.find();

    if ( getOrders ) {
      return getOrders;
    }
  },
  pizza: function( pizzaId ) {
    var getPizza = Pizza.findOne( { "_id": pizzaId } );

    if ( getPizza ) {
      return getPizza;
    }
  },
  customer: function( userId ) {
    var getCustomer = Customers.findOne( { "userId": userId } );

    if ( getCustomer ) {
      return getCustomer;
    }
  }
});
