Orders = new Meteor.Collection( 'orders' );

Orders.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  },
  remove: function(){
    // Deny removes on the client by default.
    return true;
  }
});

OrdersSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "Customer User ID"
  },
  "pizzaId": {
    type: String,
    label: "ID of Pizza Ordered"
  },
  "date": {
    type: String,
    label: "Date Pizza Was Ordered"
  }
});

Orders.attachSchema( OrdersSchema );
