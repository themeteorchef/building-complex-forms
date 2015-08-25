createPizzas = function() {

  var pizzas = [
    {
      "name": "Classic Supreme",
      "crust": "Thin",
      "toppings": {
        "meats": [ 'Sausage', 'Pepperoni' ],
        "nonMeats": [ 'Green Peppers', 'Mushrooms', 'Black Olives', 'Onions' ]
      },
      "sauce": "Tomato",
      "size": 14,
      "price": 10000,
      "custom": false
    },
    {
      "name": "Chicago",
      "crust": "Deep Dish",
      "toppings": {
        "meats": [ 'Pepperoni' ],
        "nonMeats": [ 'Banana Peppers', 'Green Peppers', 'Mushrooms', 'Black Olives', 'Onions' ]
      },
      "sauce": "Robust Tomato",
      "size": 12,
      "price": 15000,
      "custom": false
    },
    {
      "name": "Classic Pepperoni",
      "crust": "Regular",
      "toppings": {
        "meats": [ 'Pepperoni' ],
        "nonMeats": []
      },
      "sauce": "Tomato",
      "size": 12,
      "price": 10000,
      "custom": false
    },
    {
      "name": "Custom Tester",
      "crust": "Deep Dish",
      "toppings": {
        "meats": [ 'Pepperoni' ],
        "nonMeats": [ 'Feta Cheese' ]
      },
      "sauce": "Excellent Tomato",
      "size": 14,
      "price": 10000,
      "custom": true,
      "ownerId": "ABMe8MkTEvxguKKiJ"
    }
  ];

  // var pizzaCount = Pizza.find().count();
  //
  // if ( pizzaCount < 1 ) {
  //   for ( var pizza in pizzas ) {
  //     Pizza.insert( pizzas[ pizza ] );
  //   }
  // }

  for ( var pizza in pizzas ) {
    var lookupPizza = Pizza.findOne( { "name": pizzas[ pizza ].name } );

    if ( !lookupPizza ) {
      Pizza.insert( pizzas[ pizza ] );
    }
  }
};
