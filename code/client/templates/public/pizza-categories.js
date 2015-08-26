Template.pizzaCategories.helpers({
  myPizzas: function() {
    var pizzas = Pizza.find( { "custom": true, "ownerId": Meteor.userId() } );
    return { "context": "order", "content": pizzas };
  },
  popularPizzas: function() {
    var pizzas = Pizza.find( { "custom": false } );
    return { "context": "order", "content": pizzas };
  }
});
