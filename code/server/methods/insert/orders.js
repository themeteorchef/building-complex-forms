Meteor.methods({
  placeOrder: function( order ){
    check( argument, Object );

    try {

      /*
        Considerations:

        1. If there's a credentials block, create a user first.
        2. If there's a custom pizza, insert it into custom pizzas first.
        3  If there's a customer profile, insert it into customers first.
        4. Once we have a user, a custom pizza, and a customer, insert the order.
      */

    } catch( exception ) {
      return exception;
    }
  }
});
