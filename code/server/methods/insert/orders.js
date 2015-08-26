Meteor.methods({
  placeOrder: function( order ){
    check( order, Object );

    var handleOrder = {
      createUser: function( credentials ) {
        try {
          var userId = Accounts.createUser( credentials );
          return userId;
        } catch( exception ) {
          return exception;
        }
      },
      createCustomer: function( customer, userId ) {
        customer.userId = userId;
        var customerId  = Customers.insert( customer );

        return customerId;
      },
      createPizza: function( pizza, userId ) {
        pizza.ownerId = userId;

        var pizzaId = Pizza.insert( pizza );
        return pizzaId;
      },
      createOrder: function( userId, pizzaId ) {
        var orderId = Orders.insert({
          userId: userId,
          pizzaId: pizzaId,
          date: ( new Date() )
        });
        return orderId;
      }
    }

    try {
      var userId     = order.credentials   ? handleOrder.createUser( order.credentials )          : order.customer,
          customerId = order.customer.name ? handleOrder.createCustomer( order.customer, userId ) : null,
          pizzaId    = order.pizza.custom  ? handleOrder.createPizza( order.pizza, userId )       : order.pizza;
          orderId    = handleOrder.createOrder( userId, pizzaId );

      return orderId;
    } catch( exception ) {
      return exception;
    }
  }
});
