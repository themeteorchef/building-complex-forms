Template.order.onCreated( function() {
  this.subscribe( 'order' );

  this.currentOrder = new ReactiveDict();

  this.currentOrder.set({
    "type": "My Pizzas",
    "pizza": { "name": "Pick a pizza!", "price": 0 }
  });
});

Template.order.onRendered( function() {

  var template = Template.instance();

  $( "#place-order" ).validate({
    rules: {
      customPizzaName: {
        required: true
      },
      name: {
        required: true
      },
      telephone: {
        required: true
      },
      streetAddress: {
        required: true
      },
      city: {
        required: true
      },
      state: {
        required: true
      },
      zipCode: {
        required: true
      },
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    submitHandler: function() {
      var orderData = template.currentOrder;
          type      = orderData.get( "type" ),
          pizza     = orderData.get( "pizza" ),
          order     = {};

      if ( Meteor.user() ) {
        order.customer = Customers.findOne( { "userId": Meteor.userId() }, { fields: { "_id": 1 } } );
      } else {
        order.customer = {
          name: template.find( "[name='name']" ).value,
          telephone: template.find( "[name='telephone']" ).value,
          streetAddress: template.find( "[name='streetAddress']" ).value,
          secondaryAddress: template.find( "[name='secondaryAddress']" ).value,
          city: template.find( "[name='city']" ).value,
          state: template.find( "[name='state']" ).value,
          zipCode: template.find( "[name='zipCode']" ).value
        }

        order.credentials = {
          emailAddress: template.find( "[name='emailAddress']").value,
          password: template.find( "[name='password']").value
        }
      }

      if ( type === "Custom Pizza" ) {
        var meatToppings    = [],
            nonMeatToppings = [];

        $( "[name='meatTopping']:checked" ).each( function( index, element ) {
          meatToppings.push( element.value );
        });

        $( "[name='nonMeatTopping']:checked" ).each( function( index, element ) {
          nonMeatToppings.push( element.value );
        });

        var customPizza = {
          name: template.find( "[name='customPizzaName']" ).value,
          crust: template.find( "[name='crust'] option:selected" ).value,
          sauce: template.find( "[name='sauce'] option:selected" ).value,
          toppings: {
            meats: meatToppings,
            nonMeats: nonMeatToppings
          },
          custom: true,
          ownerId: Meteor.userId() || null
        };
      }

      if ( pizza.name === "Pick a pizza!" ) {
        Bert.alert( "Make sure to pick a pizza!", "warning" );
      } else {
        order.pizza = pizza._id ? pizza._id : customPizza;

        Meteor.call( "placeOrder", order, function( error, response ) {
          if ( error ) {
            Bert.alert( error.reason, "danger" );
          } else {
            Bert.alert( "Order submitted!", "success" );
          }
        });
      }
    }
  });

});

Template.order.helpers({
  customer: function() {
    if ( Meteor.userId() ) {
      var getCustomer = Customers.findOne( { "userId": Meteor.userId() } );
    } else {
      var getCustomer = {};
    }

    if ( getCustomer ) {
      getCustomer.context = "order";
      return getCustomer;
    }
  },
  order: function() {
    var currentOrder = Template.instance().currentOrder,
        type         = currentOrder.get( "type" ),
        pizza        = currentOrder.get( "pizza" ),
        price        = currentOrder.get( "price");

    if ( type !== "Custom Pizza" ) {
      var getPizza = pizza.name !== "Pick a pizza!" ? Pizza.findOne( { "_id": pizza } ) : pizza;
    } else {
      var getPizza = {
        name: "Build your custom pizza up above!",
        price: 10000
      }
    }

    if ( getPizza ) {
      return {
        type: pizza.name !== "Pick a pizza!" ? type : null,
        pizza: getPizza,
        price: getPizza.price
      }
    }
  }
});

Template.order.events({
  'click .nav-tabs li': function( event, template ) {
    var orderType = $( event.target ).closest( "li" ).data( "pizza-type" );

    template.currentOrder.set( "type", orderType );

    if ( orderType !== "Custom Pizza" ) {
      template.currentOrder.set( "pizza", { "name": "Pick a pizza!", "price": 0 } );
    } else {
      template.currentOrder.set( "pizza", { "name": "Build your custom pizza up above!", "price": 0 } );
    }
  },
  'click .pizza': function( event, template ) {
    template.currentOrder.set( "pizza", this._id );
  },
  'submit form': function( event ) {
    event.preventDefault();
  }
});
