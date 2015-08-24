Meteor.methods({
  updateCustomer: function( customer ){
    check( customer, Customers.simpleSchema() );

    try {
      Customers.update( { "userId": customer.userId }, {
        $set: customer
      });
      return exampleId;
    } catch( exception ) {
      return exception;
    }
  }
});
