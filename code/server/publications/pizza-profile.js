/*
* Publications: Example
* Data publications for the Example collection.
*/

Meteor.publish( 'pizzaProfile', function(){
  // If need be, Meteor gives us access to the current user via this.userId.
  // Example below shows using this.userId to locate documents where the
  // owner field is equal to a userId.
  var user = this.userId;

  var data = [
    Pizza.find( { "ownerId": user } ),
    Customers.find( { "userId": user } )
  ];

  if ( data ) {
    return data;
  }

  return this.ready();
});
