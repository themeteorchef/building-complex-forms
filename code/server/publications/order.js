Meteor.publish( 'order', function(){
  // If need be, Meteor gives us access to the current user via this.userId.
  // Example below shows using this.userId to locate documents where the
  // owner field is equal to a userId.
  var user = this.userId;

  if ( user ) {
    var data = [
      Pizza.find( { $or: [ { "custom": true, "ownerId": user }, { "custom": false } ] } ),
      Customers.find( { "userId": user } )
    ];
  } else {
    var data = Pizza.find( { "custom": false } );
  }

  if ( data ) {
    return data;
  }

  return this.ready();
});
