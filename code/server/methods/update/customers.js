Meteor.methods({
  updateCustomer: function( customer ){
    check( customer, Customers.simpleSchema() );

    try {
      var customerId = Customers.update( { "userId": customer.userId }, {
        $set: customer
      });

      return customerId;
    } catch( exception ) {
      return exception;
    }
  }
});
