/*
* Startup
* Functions to run on server startup. Note: this file is for calling functions
* only. Define functions in /server/admin/startup-functions.
*/

Meteor.startup(function(){

  // Custom Browser Policies
  customBrowserPolicies();

  // Generate Test Accounts
  generateTestAccounts();

  /*
   For example. We've created an example array of "Popular Pizzas" that we can
   insert into the app on startup.

   See how it works: /server/startup-functions/create-pizzas.js.
  */
  createPizzas();

});
