Accounts.onCreateUser( function( options, user ) {
  // Here, we have access to the newly created user document. We want to set up
  // a new document in our Customers collection to store some profile info for
  // our customer. We can do that here by grabbing the userId off our onCreateUser
  // callback and inserting a blank document associated *to* that user into our
  // customers collection. Neat!

  if ( options.profile && options.profile.customer ) {
    customer        = options.profile.customer;
    customer.userId = user._id;

    // We don't actually want to store this in the user profile (we just use profile
    // as a piggyback mechanism) object, so remove it so it's not inserted by accident.
    delete options.profile;

    Customers.insert( customer );
  }

  if ( options.profile ) {
    user.profile = options.profile;
  }

  return user;
});
