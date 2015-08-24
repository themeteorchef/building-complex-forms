/*
* Routes: Authenticated
* Routes that are only visible to authenticated users.
*/

Router.route( 'profile', {
  path: '/profile',
  template: 'pizzaProfile',
  onBeforeAction: function() {
    Session.set( 'currentRoute', 'profile' );
    this.next();
  }
});
