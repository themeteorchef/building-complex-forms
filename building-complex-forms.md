### Getting Started
To get started, let's add all of the packages that we'll need for this recipe. Don't worry, as we move through the recipe we'll see how these come into play.

<p class="block-header">Terminal</p>

```bash
meteor add aldeed:collection2
```
We'll rely on the [`aldeed:collection2`](https://atmospherejs.com/aldeed/collection2) package to help us add schemas to our Meteor collections. This will help us control how and what data is allowed into our collections.

<p class="block-header">Terminal</p>

```bash
meteor add reactive-dict
```
We'll use the [`reactive-dict`](https://atmospherejs.com/meteor/reactive-dict) package to help us control form state and make it a little easier to access the data in our forms.

<div class="note">
  <h3>Additional Packages <i class="fa fa-warning"></i></h3>
  <p>This recipe relies on several other packages that come as part of <a href="https://github.com/themeteorchef/base">Base</a>, the boilerplate kit used here on The Meteor Chef. The packages listed above are merely recipe-specific additions to the packages that are included by default in the kit. Make sure to reference the <a href="https://github.com/themeteorchef/base#packages-included">Packages Included list</a> for Base to ensure you have fulfilled all of the dependencies.</p>
</div>

### What are we building?
Generally speaking, most forms in our applications are pretty simplistic. This is fine, but sometimes we need to build more complex forms. Forms that rely on multiple templates, have different variations of user input, and other features that require a little more work to implement. To help wrap our head around what it takes to develop complex forms in Meteor, we're going to build a simple application for a pizzeria called [Pizza Planet](https://www.youtube.com/watch?v=DAI5wUZ3k5Q).

Our application is going to have two core features:

1. The ability to order a pizza: an existing custom pizza the user created, a pre-defined "Popular" pizza, or a new custom pizza.
2. The ability to create a "Pizza Profile" where the user can store their custom pizzas and contact information, as well as view their order history.

<figure>
  <img src="http://cl.ly/image/3z130S1D1d0J/Image%202015-08-25%20at%2011.42.36%20PM.png" alt="A screenshot of Pizza Planet's order form.">
  <figcaption>A screenshot of Pizza Planet's order form.</figcaption>
</figure>

Time's a wastin', let's get to it. To start, we're going to focus on setting up our collections and adding schemas to give our data some shape.

### Defining collections
First, let's go ahead and create a file for each of the collections that we'll have in our application and fill them with a new collection definition assigned to a global variable.

<p class="block-header">/collections/customers.js</p>

```bash
Customers = new Meteor.Collection( 'customers' );
```
Our `Customers` collection will store contact information for each of our customers.

<p class="block-header">/collections/orders.js</p>

```bash
Orders = new Meteor.Collection( 'orders' );
```
Our `Orders` collection will store _orders_ placed by our customers.

<p class="block-header">/collections/pizza.js</p>

```bash
Pizza = new Meteor.Collection( 'pizza' );
```
Our `Pizza` collection will store pizzas created by our customers and us.

#### Adding schemas to our collections
Great! Now that we have this in place, we need to add a _schema_ to each of our collections.

<div class="note info">
  <h3>Schema vs. Schemaless <i class="fa fa-info"></i></h3>
  <p>When learning about NoSQL style databases like MongoDB, you may hear the term "schemaless" used. This means—quite literally—a database without a schema. A schema is a pre-defined structure for your database (a set of rules) that can be used to control the name and type of data inserted into your database, as well as when it's allowed to be inserted.</p>
</div>

To add schemas to our collections, we're going to rely on the `aldeed:collection2` package that we installed a little bit ago. This package allows us to design a set of rules for how documents being inserted into a collection should look. We define these rules on a _per field basis_ and each field can have a handful of settings. Let's see what it looks like to add a schema and then walk through the rules for each.

<p class="block-header">/collections/customers.js</p>

```javascript
[...]

var CustomersSchema = new SimpleSchema({
  "name": {
    type: String,
    defaultValue: "",
    label: "Customer Name"
  },
  "streetAddress": {
    type: String,
    defaultValue: "",
    label: "Street Address"
  },
  "secondaryAddress": {
    type: String,
    defaultValue: "",
    label: "Secondary Address"
  },
  "city": {
    type: String,
    defaultValue: "",
    label: "City"
  },
  "state": {
    type: String,
    defaultValue: "",
    label: "State"
  },
  "zipCode": {
    type: String,
    defaultValue: "",
    label: "Zip Code"
  },
  "telephone": {
    type: String,
    defaultValue: "",
    label: "Telephone"
  },
  "userId": {
    type: String,
    label: "Associated User ID"
  }
});

Customers.attachSchema( CustomersSchema );
```
Woah! Wait a minute! This isn't as scary as it seems. This is a "schema" in all it's glory. It's quite literally an object of rules mapped to the names of fields. The idea here is simple: when we go to insert a document into this collection—in this case our `Customers` collection—the `collection2` package will _validate_ that data against the rules we define here. 

So, notice that we're planning on having a field in each of our customer documents called `name`. Using the [options given to use by collection2](https://github.com/aldeed/meteor-simple-schema#schema-rules), we've created a rule for this field that:

1. Make sure the data `Type` is a `String` value.
2. Set's the `defaultValue` to an empty string (this will make sense later).
3. Gives the field an arbitrary label for the field to reference later (collection2 generally uses this to identify errors on fields).

Combined, these three options set to the field `name` ensure that every single document we insert will have a `name` field, but also, that that field will follow these specific rules. If the field doesn't exist or doesn't meet this criteria, collection2 will quietly reject the insert.

Let's look at our other schemas and keep explaining how this is wired up.

<p class="block-header">/collections/orders.js</p>

```javascript
var OrdersSchema = new SimpleSchema({
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
```

This one is a little simpler. Notice here we follow the same concept: for each field that will live in our document, we add a new rule with the _exact name the field will carry in the collection_, along with a few settings for how that field should take shape. Wait...what is this `SimpleSchema` thing, though?

[SimpleSchema](https://github.com/aldeed/meteor-simple-schema) is another package by the author of collection2 that gives us the actual syntax for defining schemas along with the methods to actually _validate_ that data. collection2, then, is best thought of as a more user-friendly wrapper around SimpleSchema that automates the validation of data by automatically applying it to a collection. We can see this happening in the example above on the last line `Orders.attachSchema( OrdersSchema )`. 

This is taking the schema we've defined above it—assigned to the `OrdersSchema` variable—and "attaching" it to our `Orders` collection. Notice, this is just calling a method `attachSchema` that has been added by collection2 to our MongoDB collection definition. Neat! 

With this in place, all of the data that we attempt to insert into our collection will be validated against this schema before we allow the insert. That's it. Nice, eh? Real quick, let's take a look at our last collection `Pizza` and see how its schema is taking shape.

```javascript
var PizzaSchema = new SimpleSchema({
  "name": {
    type: String,
    label: "Name of Pizza"
  },
  "crust": {
    type: String,
    label: "Type of Crust"
  },
  "toppings.meats": {
    type: [ String ],
    label: "Meat Toppings",
    optional: true
  },
  "toppings.nonMeats": {
    type: [ String ],
    label: "Non-Meat Toppings",
    optional: true
  },
  "price": {
    type: Number,
    label: "Price"
  },
  "sauce": {
    type: String,
    label: "Type of Sauce"
  },
  "size": {
    type: Number,
    label: "Size of Pizza"
  },
  "custom": {
    type: Boolean,
    label: "Custom Pizza"
  },
  "ownerId": {
    type: String,
    label: "Pizza Owner's User ID",
    optional: true
  }
});

Pizza.attachSchema( PizzaSchema );
```
This one has a few more fields with slightly less obvious settings on some of those fields. Let's call attention to one of our field definitions: `toppings.meats`. This field has a weird type of `[ String ]`. Here, this means that we expect the value of `toppings.meats` to be equal to an _array_ of strings. This syntax is a bit odd, I know. Notice, too, that we're defining this field off a parent object `toppings`. Why don't we have to add a rule for that?

Because `toppings` only contains this `meats` array and another array `nonMeats`—no top-level data in the parent object—we can forgo validating that and just focus on its contents. Something else that's interesting too, here, is that we're passing another option `optional: true`. This does exactly what you'd expect: make this field optional. So, when we go to insert a document into this collection, it doesn't matter if a `toppings.meats` field is defined; collection2 will take it either way. Nice!

<div class="note info">
  <h3>More on collection2 <i class="fa fa-info"></i></h3>
  <p>Our usage of collection2 here is pretty simple. If you're curious about how to use collection2 and some of the gotchas involved in working with it, check out <a href="http://themeteorchef.com/snippets/using-the-collection2-package">this snippet</a> on the topic.</p>
</div>

Now that we have some structure for our data, we're going to add some publications. Wait...what? Bear with me. We'll be diving into some pretty complicated stuff later on, so it's important that we get this easy stuff out of the way now, even if it's not 100% clear how it will come into play. Don't worry, we'll make sense of it all by the final sentence!

### Defining publications
Okay. So, to make our publications a little more efficient, we're going to think about how we define them in terms of where they'll be used. In our app, we'll have two distinct views: the order form and the pizza profile. Each view is going to have multiple pieces of data in it, but we don't want to define multiple publications for each view. How do we get around that? [Complex publications](http://themeteorchef.com/snippets/publication-and-subscription-patterns/#tmc-complex-publication).

Complex publications are just a fancy TMC word for publications that return multiple MongoDB cursors. Generally when we think of publications, we only return a single cursor or `Collection.method()` call. Fortunately, we can return _multiple_ cursors from the same publication, allowing us to consolidate our efforts. Let's take a look at the publication for our order form to start.

<p class="block-header">/server/publications/order.js</p>

```javascript
Meteor.publish( 'order', function(){
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
```
Not _too_ crazy. First, we give our publication a simple name to identify where it will be used, in this case the `order` form. Inside, we start by grabbing the current user's ID. Remember, [we have access to this from inside publications](http://themeteorchef.com/snippets/publication-and-subscription-patterns/#tmc-simple-publications) as an added security-minded bonus. Next, if we have a logged in user, we create a new variable `data` and assign it to an array with two methods inside: `Pizza.find( { $or: [ { "custom": true, "ownerId": user }, { "custom": false } ] } )` and `Customers.find( { "userId": user } )`. Together, these two calls make up all of the data that we'll need on the order form screen _when a user is logged in_.  

That first one is pretty gnarly. What's that `{ $or ... }` business? This is pretty neat. Here, we can perform "multiple queries" on the same collection using a single call. Using the [MongoDB $or operator](https://docs.mongodb.org/v3.0/reference/operator/query/or/), we can ask MongoDB to give us all of the documents that match different queries. We can pass our separate queries in array and get back a single cursor with the documents matching either query. Wow! This is handy because if we tried to pass two `Pizza.find()` calls in this array with our different queries, we'd get an error. 

The second query here `Customers.find()` is a little more obvious. Here, we expect to have a `userId` field on documents in our `Customers` collection and we want to get back the documents that match the _currently logged in user_. Easy peasy.

Just after this, we provide an `else` statement, setting our `data` variable to a single query. Notice that in this case, if we don't have a currently logged in user, we don't want to look up a `Customers` document. Again, this will make sense later, so just follow along.

Lastly, we return our data if we have any and a call to `this.ready()` to [make sure our publication completes](http://themeteorchef.com/snippets/publication-and-subscription-patterns/#tmc-simple-publications).

<div class="note">
  <h3>Skipping our pizzaProfile publication <i class="fa fa-warning"></i></h3>
  <p>We have one more publication being defined in our app called <code>pizzaProfile</code> that will be used in our Pizza Profile template. It's nearly identical to this publication, so we're going to skip reviewing it here. If you're curious, you can <a href="https://github.com/themeteorchef/building-complex-forms/blob/master/code/server/publications/pizza-profile.js">find the file on GitHub here</a>.</p>
</div>

We'll cover subscribing to these publications in a little bit. For now, let's setup a helper function on the server that will insert some pizzas into our `Pizza` collection when our app starts up.

### Adding some dummy data
This is pretty simple, but will help us to understand how our schema from earlier comes into play; at least, in relation to our `Pizza` collection. Let's take a look.

<p class="block-header">/server/admin/startup-functions/create-pizzas.js</p>

```javascript
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
      "price": 1000,
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
      "price": 1500,
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
      "price": 1000,
      "custom": false
    }
  ];

  var pizzaCount = Pizza.find().count();

  if ( pizzaCount < 1 ) {
    for ( var pizza in pizzas ) {
      Pizza.insert( pizzas[ pizza ] );
    }
  }
};
```
Bog standard JavaScript. We create a function called `createPizzas()` that we can call later—we won't show it here but we do this in `/server/admin/startup.js`—when our server starts up. Next, we define an array of objects that represent some "dummy" pizzas in our application. Later on, we'll use these to represent "Popular Pizzas" in our application. 

Notice, each of these pizzas follows our schema by the book. This is intentional. Below when we go to insert pizza's into our collection, behind the scenes our schema will be called against each of these pizzas. Remember, if our data doesn't meet our schemas criteria, it's getting kicked to the curb by collection2.

Okay. Underwhelming, sure, but important (and illustrative)! Now, when our server starts up we'll get some pizzas added to our `Pizza` collection to work with later.

### Creating a pizza profile
Now that we've got the basic pieces in place for handling data, we need to figure out how users will move in-and-out of our application. To explain, here's a quick peek at the home page users see when they first visit our application.

<figure>
  <img src="http://cl.ly/image/2a3k3r2R1u22/Image%202015-08-26%20at%2012.52.59%20AM.png" alt="The Pizza Planet home page.">
  <figcaption>The Pizza Planet home page.</figcaption>
</figure>

We'll be giving our users two options when they first visit our site: starting a new order or gettng a pizza profile. Both will handle new user signups accordingly, but to get things underway, let's look at that "Get a Pizza Profile" option first.

#### Sign up form
Sneaky, us. Signing up for a Pizza Profile is really just creating an account in our application with a twist. We're going to piggyback on the [signup feature of Base](https://github.com/themeteorchef/base/blob/master/client/controllers/public/signup.js) that's already been built for us. Let's fast forward and look at the template logic for our `signup` template, with a slight modification for our Pizza-rific use case here.

<p class="block-header">/client/templates/public/signup.js</p>

```javascript
[...]

Accounts.createUser({
  email: user.email,
  password: user.password,
  profile: {
    customer: {
      userId: user._id,
      name: "",
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      zipCode: "",
      telephone: ""
	}
  }
}, function( error, userId ){
  if( error ) {
    Bert.alert(error.reason, 'danger');
  } else {
	Bert.alert('Welcome to Pizza Planet!', 'success');
  }
});

[...]
```
What's going on here? Well, inside of the `submitHandler` portion of our signup form's validation—in the `onRendered` callback for the template—we're calling to `Accounts.createUser`. The part to pay attention to is what data we're passing. We've got our usual `email` and `password` fields...but why are we setting `profile.customer` to a bunch of empty stuff? Ah ha! This is black magic, plain and simple. 

#### Tapping into the onCreateUser callback

When we create our user, we also want to create a blank customer profile _for that user_ in our `Customers` collection. To do this, we can pass our placeholder data here. To make it work, though, we have to tap into our application's `onCreateUser` function.

<p class="block-header">/server/create-user.js</p>

```javascript
Accounts.onCreateUser( function( options, user ) {
  if ( options.profile && options.profile.customer ) {
    customer        = options.profile.customer;
    customer.userId = user._id;

    delete options.profile;

    Customers.insert( customer );
  }

  if ( options.profile ) {
    user.profile = options.profile;
  }

  return user;
});
```
Hot diggity dog, right? Here, we tap into the user creation process for our app. Though this isn't added by default—we have to create this file and call this method—we can use this  to modify the new user document and otherwise tap into the "signup" flow for our app. 

For our purposes, notice that we look at the `options.profile` value here, and more specifically, check for the existence of the `options.profile.customer` value. If both exist, we grab the blank customer data, stash it in a variable `customer`, set the newly created `userId` on it, and then `delete` the profile all together. Without a trace! 

Just after this, we go ahead and insert our new customer into the `Customers` collection. Rad! So now, without our user ordering a pizza, we create a complete Pizza Profile for them. Well, in theory. We haven't created the profile view yet, but this gets all of the data we need in place.

That last part is just for safety's sake. Even though we've already toasted our `profile` value, this will ensure that if _you_ decide to add an actual profile later, it won't get nuked. Yeah, the Chef cares. _Group hug_.

Enough! Let's start to put this together. We're going to start by wiring up the contact information portion of our `pizzaProfile` template that relies on this document we just inserted into our `Customers` collection. Let's dig in.

#### Managing contact information in the pizza profile
To get started, we're going to add two files to our app: our HTML template at `/client/templates/authenticated/profile.html` and our complimentary template logic at `/client/templates/authenticated/profile.js`. Got it? Okay, let's check out our HTML first.

<div class="note">
  <h3>Routes setup for us <i class="fa fa-warning"></i></h3>
  <p>We won't cover it here, but to get this working 100%, we've already <a href="https://github.com/themeteorchef/building-complex-forms/blob/master/code/client/routes/routes-authenticated.js">setup a route</a> that points to <code>http://localhost:3000/profile</code> and loads up our <code>pizzaProfile</code> template for us.</p>
</div>

<p class="block-header">/client/templates/authenticated/pizza-profile.html</p>

```markup
<template name="pizzaProfile">
  [...]

  <h4 class="page-header">Contact Information</h4>
  {{#with customer}}
    {{> Template.dynamic template="contactInformation"}}
  {{/with}}
</template>
```
What in the heck is this Jetson's business? Hang in there. To explain, we want to be as economical as possible with our templates. As we'll see later on, we'll need access to our `contactInformation` template in our order form, too. Instead of recreating the exact same template twice, we can use Meteor's handy `{{> template.dynamic}}` feature to use our template in different contexts (i.e. different features in different places using the same template). Strap in!

First, we need to point out that we're wrapping our dynamic template call in a `{{#with customer}}` block. This is our special sauce. Here, we're telling Meteor to include our template, but making it's data context equal to the `{{customer}}` helper defined on our `pizzaProfile` template's logic. Wild. So, inside of our `contactInformation` template, we'll have access to whatever data is returned to this `{{customer}}` helper. Let's take a peek at the helper and then look at the `contactInformation` template to close the loop.

<p class="block-header">/client/templates/authenticated/pizza-profile.js</p>

```javascript
Template.pizzaProfile.onCreated( function() {
  this.subscribe( 'pizzaProfile' );
});

Template.pizzaProfile.helpers({
  [...]
  customer: function() {
    var getCustomer = Customers.findOne( { "userId": Meteor.userId() } );
    if ( getCustomer ) {
      getCustomer.context = "profile";
      return getCustomer;
    }
  }
});
```
SO much sneakiness. We're actually going to handle two things here. First, recall that earlier we set up a publication that in part exposes our current user's customer profile via a call to `Customers.find()`. Here, we use [template-level subscriptions](http://themeteorchef.com/snippets/publication-and-subscription-patterns/#tmc-subscribing-in-the-template) to subscribe to our publication by calling `this.subscribe( 'pizzaProfile' );`. Boom! Now, whenver our `pizzaProfile` template is loaded up, we'll get access to all of the data we need for our profile's various pieces. Shred.

Okay, main event, that `{{customer}}` helper. Here, we do a standard `.find()` call on our `Customers` collection, pulling in the currently logged-in user. If we get the customer, we set an additional value on it called `context`, setting it to `"profile"`. Again, we'll do something similar later so we can reuse the template for our order form. Once that's set, we return our customer! Now, our `{{#with}}` block will evaulate to `true`, or, "I have data," and render our `contactInformation` template. To understand the significance of this, let's take a peek at the logic for `contactInformation`.

<p class="block-header">/client/templates/public/contact-information.js</p>

```javascript
Template.contactInformation.helpers({
  isProfile: function( location ) {
    return Template.instance().data.context === "profile" ? true : false;
  }
});

[...]
```
Womp. Pretty underwhelming, but very cool. Here, we create another helper that we can use in our `contactInformation` template that returns a `true` or `false` value based on the current context. Remember how we set that earlier in our `{{customer}}` helper? Well, because we used a `{{#with}}` block, we essentially "took over" the data context for our template instance. 

<figure>
  <img src="http://cl.ly/image/2r0e0P330C3O/Image%202015-08-26%20at%209.58.49%20AM.png" alt="Our contact information form in the context of our pizza profile.">
  <figcaption>Our contact information form in the context of our pizza profile.</figcaption>
</figure>

This means that now, we can access the data assigned way up in the parent template using `Template.instance().data`. Here, then, we just point to our `context` value in our data and evaluate whether it's equal to `"profile"` or not. [Swish](https://www.youtube.com/watch?v=9RaAgI7eZMg)!

So what does this do? Let's look at the markup.

<p class="block-header">/client/templates/public/contact-information.html</p>

```markup
<template name="contactInformation">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      [...]
      {{#if isProfile}}
        <div class="form-group">
          <input type="submit" class="btn btn-success" value="Save Profile Information">
        </div>
      {{/if}}
    </div>
  </div>
</template>
```
We'll skip the boring form fields part and jump straight to the hotness. See what's happening here? We've set up an `{{#if isProfile}}` block using our helper which spits out a "Save Profile" button if we're on the profile! This may seem insignificant now, but later, this will ensure that this button _does not_ show up when we use this same template in our order form. It's the little things.

<div class="note">
  <h3>Skipping the update logic <i class="fa fa-warning"></i></h3>
  <p>To save some time—time is money after all—we're going to skip reviewing the logic for updating our contact information from the Pizza Profile. Rest assured, it <em>is</em> imeplemented and you can <a href="https://github.com/themeteorchef/building-complex-forms/blob/master/code/client/templates/public/contact-information.js">find it in the source over on GitHub</a>.</p>
</div>

Now we're cruising. Let's upgrade to the big leagues, though, and start working on the reason we're all here: the order form.

### Creating an order form
Remember earlier when we showed the home page for our app that we also had a "Start an Order" button? Let's get that thing wired up. Take a deep breath, we're going to cover a lot in just a little bit of time. You'll be a different person by the time you finish reading. Ready?

#### Adding the category tabs
Recall earlier that we outlined three possible types of orders our user will be able to place:

1. A custom pizza that they saved from an earlier visit.
2. A pre-made, "Popular Pizza" that already has it's toppings picked out.
3. A new custom pizza.

To handle this, we're going to create a tabbed interface that allows our users to switch between these three types of orders, tracking their movement in the UI so we know which type of order is being placed. To start, let's look at the markup for our order form to see how these tabs will fit in.

<p class="block-header">/client/templates/public/order.html</p>

```markup
<template name="order">
  <div class="jumbotron text-center">
    <h2>Place an Order</h2>
    <p>Tell us what pizza you want and we'll put it on our rocketship to you in less than 30 minutes!</p>
  </div>

  <form id="place-order">
    <h3 class="page-header">How do you want to order?</h3>

    <div class="form-group">
      <p>Pick a category to choose from, or build a custom pizza and save it for later!</p>
    </div>

    {{> pizzaCategories}}

    [...]

    <div class="submit-row">
      <input type="submit" class="btn btn-success" value="Send My Order!">
    </div>
  </form>
</template>
```
When all is said and done, we'll have three distinct sections in our order form. To start, we're going to create a new template called `pizzaCategories` that will handle our tabbed interface. Here, though, we can see that we're wrapping an include to that new template in a `<form id="place-order">` tag. This isn't important now, but it's good to understand what we're after. The goal here is to make one giant form out of several smaller forms and submit them as one. Before we get too far head of ourselves, let's look at the markup for our `pizzaCategories` template.

<p class="block-header">/client/templates/public/pizza-categories.html</p>

```markup
<template name="pizzaCategories">
  <ul class="nav nav-tabs" role="tablist">
    {{#if currentUser}}
      <li role="presentation" data-pizza-type="My Pizzas" class="active"><a href="#my-pizzas" aria-controls="my-pizzas" role="tab" data-toggle="tab">My Custom Pizzas</a></li>
      <li role="presentation" data-pizza-type="Popular Pizzas"><a href="#popular-pizzas" aria-controls="popular-pizzas" role="tab" data-toggle="tab">Popular Pizzas</a></li>
    {{else}}
      <li role="presentation" data-pizza-type="Popular Pizzas" class="active"><a href="#popular-pizzas" aria-controls="popular-pizzas" role="tab" data-toggle="tab">Popular Pizzas</a></li>
    {{/if}}
    <li role="presentation" data-pizza-type="Custom Pizza"><a href="#custom-pizza" aria-controls="custom-pizza" role="tab" data-toggle="tab">Build a Pizza</a></li>
  </ul>

  <div class="tab-content">
    {{#if currentUser}}
      <div role="tabpanel" class="tab-pane active" id="my-pizzas">
        {{> Template.dynamic template="pizzaList" data=myPizzas}}
      </div>
      <div role="tabpanel" class="tab-pane" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{else}}
      <div role="tabpanel" class="tab-pane active" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{/if}}
    <div role="tabpanel" class="tab-pane" id="custom-pizza">
      {{> buildPizza}}
    </div>
  </div>
</template>
```
Quit yet? This is actually fairly harmless. Let's step through it.

First, there are two parts to this: the tabs and the content. The tabs part is the `<ul class="nav nav-tabs">` part, with the content located in `<div class="tab-content">` down below. When we click on a tab, we'll rely on Bootstrap to do it's thing and reveal the correct content or "panel." Let's start with those tabs.

Here, we're trying to cover two scenarios. First, if we have a logged in user, we want to show them their previously created pizzas, so we make this tab available if a `currentUser` is available. Additionally, we also pull in the Popular Pizza's tab here. Why? Notice that if the "My Pizzas" tab is available, _that tab_ should have an `.active` CSS class. If it's not available, then we'd want our "Popular Pizzas" tab to be active as it moves into the first position if "My Pizzas" isn't there. This is purely cosmetic and for UX-sake, but good to point out. Real quick, notice that extra `data-pizza-type` attribute we're setting on each `<li>`?

This is what we're going to use to identify which tab our user has clicked on in our form. To make sense of it, let's look at the logic for our `order` template real quick.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.onCreated( function() {
  this.subscribe( 'order' );

  this.currentOrder = new ReactiveDict();

  if ( Meteor.user() ) {
    this.currentOrder.set( "type", "My Pizzas" );
  } else {
    this.currentOrder.set( "type", "Popular Pizzas" );
  }

  this.currentOrder.set( "pizza", { "name": "Pick a pizza!", "price": 0 } );
});

[...]

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
  [...]
});
```
A few things to point out. First, notice that in our `order` template's `onCreated` we're subscribing to our `order` publication similar to how we handled our `pizzaProfile` publication earlier. Next, we're defining a new variable on our template instance `this.currentOrder` and assigning it to [an instance of ReactiveDict()](http://themeteorchef.com/snippets/reactive-dict-reactive-vars-and-session-variables/#tmc-reactive-dictionary). 

If you've never seen it before, [ReactiveDict](https://atmospherejs.com/meteor/reactive-dict)—a package we added at the start of this recipe—allows us to keep a _reactive dictionary_ of values. What's neat about it is that we can use it locally like we've done here, assigning it to a template instance. This allows us to store reactive data, but avoid using something that's defined on a more global-basis like Session variables. Fun fact: Session variables are just a wrapper around ReactiveDict.

Cool. So, just after we set our dictionary up, we also set some initial values on it. Here, we're setting a `type` and `pizza` value. The `type` value here is simply saying that the _type_ of order by default will be "My Pizzas" if there's a current user, or "Popular Pizzas" if there is not (this accounts for our `currentUser` tab switching from a little bit ago). That "pizza" setting right now is just for show. That will be used to display some default values later on. For now, just know that we've set it.

Okay! The important part. Down in the event map for our `order` template, we can see we're watching for clicks on our `.nav-tabs` (our tabs) element. Inside the handler, we grab that data attribute we set in the markup and set the `type` setting on our `ReactiveDict` accordingly. We also make sure to set our `pizza` value up with some default data, depending on which tab was clicked ("Custom Pizza" vs. "My Pizzas" or "Popular Pizzas"). Following along?

Again, it doesn't seem like much but now we'll be tracking which tab is toggled in our form. This will help us in a little bit.

#### Loading our templates for each tab
Now that we've got our tabs wired up, we need to assign a template to each of those tabs. To do this, we're going to rely on that `{{> Template.dynamic}}` trick we learned about earlier. Let's pop back over to the markup for our `pizzaCategories` template quick and then chat about the logic that's making it all work.

<p class="block-header">/client/templates/public/pizza-categories.html</p>

```markup
<template name="pizzaCategories">
  [...]
  <div class="tab-content">
    {{#if currentUser}}
      <div role="tabpanel" class="tab-pane active" id="my-pizzas">
        {{> Template.dynamic template="pizzaList" data=myPizzas}}
      </div>
      <div role="tabpanel" class="tab-pane" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{else}}
      <div role="tabpanel" class="tab-pane active" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{/if}}
    <div role="tabpanel" class="tab-pane" id="custom-pizza">
      {{> buildPizza}}
    </div>
  </div>
</template>
```
This should all be starting to look familiar. Here, we match our tabs check for a `currentUser` with our tab content. Same exact idea, but instead of tabs we're loading in templates, assigning an `.active` class to the `.tab-pane` element wrapping our includes. Here, we've got four includes, but we're only pulling in two templates. Let's talk about that `{{> Template.dynamic template="pizzaList" data=myPizzas}}` one first.

Earlier when we learned about dynamic templates, we wrapped our template in a `{{#with}}` block to pass it some data. We did that there because we needed a way to pull in data and set context from within the template. This time around, though, we're going to pass both our context _and_ our data as a helper defined in our `pizzaCategories` template and _pass that_ to our `pizzaList` template using the `data` attribute of our `Template.dynamic` include. Let's take a look at the logic for our helpers and then see how that `pizzaList` template makes sense of it all.

<p class="block-header">/client/templates/public/pizza-categories.js</p>

```javascript
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
```
Interesting! We start with something familiar by calling a `.find()` on our `Pizza` collection for both of our different use cases (our logged in user's pizzas and our auto-generated pizza's from earlier). Next, instead of just returning our data directly, we return an object with two values: `context` and `content`. On `context`, we set the "location" where our template is being loaded and on `content`, we pass the data we just pulled out of the database. This may not make complete sense on it's own. Let's look at the `pizzasList` template's logic. There, we'll see how the data is handled.

<p class="block-header">/client/templates/public/pizza-list.js</p>

```javascript
Template.pizzaList.helpers({
  isProfile: function() {
    var templateData = Template.instance().data;
    return templateData.context === "profile" ? true : false;
  },
  currentList: function() {
    return Template.instance().data;
  },
  pizzas: function() {
    var data = Template.instance().data.content;

    if ( data ) {
      return data;
    }
  }
});
```
Two birds, meet your stone. This is really cool. Because we need to use our `pizzaList` template several times, we need a way to pipe in data for it but also make note of its context. Just above when we set our helpers to an object, we were doing that so we could reference both the context and the data here. Recall that we passed our helpers to our dynamic template include's `data` attribute. 

<figure>
  <img src="http://cl.ly/image/3p0E3m3n0T3p/Image%202015-08-26%20at%209.45.22%20AM.png" alt="How our list of pizzas will look when we finish.">
  <figcaption>How our list of pizzas will look when we finish.</figcaption>
</figure>

Following that train of thought, we can see that we make an `isProfile` helper that can be used inside of our `pizzaList` template relying on our `context` value, and down below, our `content` value being set to a new `pizzas` helper that will be tied to an `{{#each pizzas}}` block to output each of our pizzas. What's neat about this is that this `pizzas` helper isn't tied to a specific type of data. We can send it any type of—pizza related—data and it will format the list accordingly in the template! This saves us a lot of duplication but also makes it very easy to understand the flow of data in our templates. Win/win!

<p class="block-header">/client/templates/public/pizza-categories.html</p>

```markup
<template name="pizzaCategories">
  [...]
  <div class="tab-content">
    {{#if currentUser}}
      <div role="tabpanel" class="tab-pane active" id="my-pizzas">
        {{> Template.dynamic template="pizzaList" data=myPizzas}}
      </div>
      <div role="tabpanel" class="tab-pane" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{else}}
      <div role="tabpanel" class="tab-pane active" id="popular-pizzas">
        {{> Template.dynamic template="pizzaList" data=popularPizzas}}
      </div>
    {{/if}}
    [...]
  </div>
</template>
```
Back in our `pizzaCategories` template, we can see this technique being used for both our `myPizzas` and `popularPizzas` data sources. How cool is that? Using a single template, we get the same styles but pipe in different data. Polish off that Swiss Army Knife.

With this in place, we can move on to our third tab and template: "Build a Pizza" and the `buildPizza` template.

<p class="block-header">/client/templates/public/build-pizza.html</p>

```markup
<template name="buildPizza">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label>Custom Pizza Name</label>
            <input type="text" class="form-control" name="customPizzaName">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <h4 class="page-header">Pizza Size</h4>
            <select name="size" class="form-control">
            {{#each sizes}}
              <option value="{{this}}">{{this}}"</option>
            {{/each}}
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-group clearfix">
          <div class="col-xs-12 col-sm-6">
            <h4 class="page-header">Crust</h4>
            <select name="crust" class="form-control">
            {{#each crusts}}
              <option value="{{this}}">{{this}}</option>
            {{/each}}
            </select>
          </div>
          <div class="col-xs-12 col-sm-6">
            <h4 class="page-header">Sauce</h4>
            <select name="sauce" class="form-control">
            {{#each sauces}}
              <option value="{{this}}">{{this}}</option>
            {{/each}}
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12">
          <h4 class="page-header">Toppings</h4>
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <h5 class="page-header">Meats</h5>
              {{#each toppings.meats}}
                <label class="topping"><input type="checkbox" name="meatTopping" value="{{this}}"> {{this}}</label>
              {{/each}}
            </div>
            <div class="col-xs-12 col-sm-6">
              <h5 class="page-header">Non-Meats</h5>
              {{#each toppings.nonMeats}}
                <label class="topping"><input type="checkbox" name="nonMeatTopping" value="{{this}}"> {{this}}</label>
              {{/each}}
            </div>
          </div> <!-- Holy-->
        </div> <!-- Nested -->
      </div> <!-- Div's -->
    </div> <!-- Batman! -->
  </div> <!-- Batman! -->
</template>
```
Despite it sounding like a really complicated step, our `buildPizza` template is actually quite simplistic. It's got a few form fields, some dropdown lists, but nothing that wild. Hm. The tricky party with this will come later when we need to get these values _back_. For now, let's talk about how this template is getting its data.

#### Default values in settings.json
As part of our ordering process, customers will be able to build a custom pizza. In order to facilitate this process, we need a way to give them all of the "parts" of a pizza. To do this, we can store some basic data in our [settings.json file](http://themeteorchef.com/snippets/making-use-of-settings-json). 

<div class="note">
  <h3>Just for simplicty sake <i class="fa fa-warning"></i></h3>
  <p>Here, we're loading in this data using a settings file for simplicty sake. In a real application, we'd likely tie this into a collection that was managed via a backend interface. There isn't anything wrong with this, but generally our settings file is reserved for application settings and configuration. Whether the info here should be added there is up for debate :)</p>
</div>

First, let's take a peek at our settings file and see what sort of data we're making available. After that, we'll look at the template logic and see how it's all glued together.

<p class="block-header">settings-development.json</p>

```javascript
{
  "public": {
    "toppings": {
      "meats": [
        "Sausage",
        "Pepperoni",
        "Bacon",
        "Ham",
        "Beef"
      ],
      "nonMeats": [
        "Banana Peppers",
        "Green Peppers",
        "Mushrooms",
        "Black Olives",
        "Onions",
        "Feta Cheese",
        "Jalapeno Peppers",
        "Pineapple"
      ]
    },
    "crusts": [
      "Regular",
      "Thin",
      "Deep Dish",
      "Pan"
    ],
    "sauces": [
      "Tomato",
      "Roboust Tomato",
      "Alfredo",
      "Barbecue"
    ],
    "sizes": [
      10,
      12,
      14,
      16
    ]
  }
}
```
Very simple. Nested inside of our `public` object, we've added a few types of information that our user will be able to choose from when customizing their pizza: `toppings`, `crusts`, `sauces`, and `sizes`. In order to make these useful then, we need to map each to an element in our form we defined above. It's really simple, let's take a peek.

<p class="block-header">/client/templates/public/build-pizza.js</p>

```javascript
Template.buildPizza.helpers({
  crusts: function(){
    return Meteor.settings.public.crusts;
  },
  sauces: function(){
    return Meteor.settings.public.sauces;
  },
  toppings: function(){
    return Meteor.settings.public.toppings;
  },
  sizes: function(){
    return Meteor.settings.public.sizes;
  }
});
```
Well that's certainly...spartan. Yep! The name of the game here is simplicity. Again, we could easily replace these with database queries, but this gives us a quick and easy way to manage some static data in our app without jumping through a lot of hoops. Now, when we load up our order form and view the "Build a Pizza" tab, we should see something like this:

<figure>
  <img src="http://cl.ly/image/2c0j2o1P401u/Image%202015-08-26%20at%209.43.51%20AM.png" alt='The "Build a Pizza" interface in our form.'>
  <figcaption>The "Build a Pizza" interface in our form.</figcaption>
</figure>

Pretty cool, right? As you saw above, we're just using a series of `{{#each}}` blocks to output the information we've piped in from our settings file. Incredibly simple, but has a huge impact on our form. With this in place, we've finished up our pizza categories portion of our order form. Next, let's focus in on adding our contact information block from earlier along with a few other things.

<p class="block-header">/client/templates/public/order.html</p>

```markup
<template name="order">
  <div class="jumbotron text-center">
    <h2>Place an Order</h2>
    <p>Tell us what pizza you want and we'll put it on our rocketship to you in less than 30 minutes!</p>
  </div>

  <form id="place-order">
    [...]

    <h3 class="page-header">Where should we send your pizza?</h3>

    {{#with customer}}
      {{> Template.dynamic template="contactInformation"}}
    {{/with}}

    {{#unless currentUser}}
      <h3 class="page-header">Create a pizza profile</h3>
      <p>Specify a username and password for your pizza profile. This is <strong>required to place your order</strong>.</p>
      {{> profileSignup}}
    {{/unless}}

    <h3 class="page-header">Confirm and send your order</h3>
    {{#with order}}
      {{> orderConfirmation}}
    {{/with}}

    <div class="submit-row">
      <input type="submit" class="btn btn-success" value="Send My Order!">
    </div>
  </form>
</template>
```

A handful of items here, but don't worry we'll step through each. First and most exciting, we can see that we've added in a dynamic include to our `contactInformation` template. Using our `{{#with}}` block trick from earlier, we pull in our customer data. Real quick, let's look at how that works at the logic level.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
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
  }
});
```
Some familiar stuff coming into play. Recall that we have to account for two states when it comes to our order form: when a user is logged in and when they're not. Here, we can see ourselves handling this by using an if block where we return a customer from the `Customers` collection if we have a current user, and if not, just returning an empty object. 

We also bring back our technique of setting a context on the customer document just before we return it to the template. Where earlier we set our context to `"profile"`, now we rely on `"order"` because we're in the order form. This ensures that all of that profile-only functionality doesn't show up here. Though not terribly thrilling, here is the result we get:

<figure>
  <img src="http://cl.ly/image/1v2n3m300u1B/Image%202015-08-26%20at%209.56.32%20AM.png" alt="Our contact information form in the context of our order form.">
  <figcaption>Our contact information form in the context of our order form.</figcaption>
</figure>

Notice that unlike in our Pizza Profile from earlier, we don't see the green "Save Profile Information" button because it's blocked by our `{{#if isProfile}}` block inside of our `contactInformation` template. Think about how that's working for a second. Isn't that cool?

Hanging in there? We've got a few more things to cover. Next, let's tackle that `profileSignup` form we include in our order form if there isn't a current user logged in.

<p class="block-header">/client/templates/public/order.html</p>

```markup
{{#unless currentUser}}
  <h3 class="page-header">Create a pizza profile</h3>
  <p>Specify a username and password for your pizza profile. This is <strong>required to place your order</strong>.</p>
  {{> profileSignup}}
{{/unless}}
```
For reference, this is how our include lives in the order form. Let's take a look at that `profileSignup` template real quick.

<p class="block-header">/client/templates/public/profile-signup.html</p>

```markup
<template name="profileSignup">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      <div class="form-group">
        <label for="emailAddress">Email Address</label>
        <input type="email" class="form-control" name="emailAddress">
      </div>
      <div class="form-group">
        <label for="password">Password <span class="text-muted">(at least six characters)</span></label>
        <input type="password" class="form-control" name="password">
      </div>
    </div>
  </div>
</template>
```
Well...okay then! Dirt simple. This gives us an `emailAddress` and `password` field to display if we don't have a current user. This means that if a user attempts to place an order without being logged in, we ask them for an email address and password to "save" their order information. What's neat about this is that we'll be able to create a user account for this user without them having to do it first. The shortest path between yourself and pizza is a straight line. Repeat that.

Great. Now, let's look at the very last part of our order form: the order confirmation area.

<figure>
  <img src="http://cl.ly/image/3p3h0G2h3y45/Image%202015-08-26%20at%2010.08.18%20AM.png" alt="What we're trying to achieve: a summary of our order.">
  <figcaption>What we're trying to achieve: a summary of our order.</figcaption>
</figure>

Because we want to be super helpful to our customers, it seems wise to add an order confirmation area just before we send in orders. This allows our customer to confirm that they're getting the pizza they asked for as well as how much it will cost. We've watered this down a bit for simplicity, but you could beef it up quite a bit if you found yourself building a pizza ordering app! Real quick, let's take a peek at the markup and then see how it's wired up.

<p class="block-header">/client/templates/public/order-confirmation.html</p>

```markup
<template name="orderConfirmation">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Pizza</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{#if type}}{{type}} &mdash; {{/if}}{{pizza.name}}</td>
        <td class="text-right">{{toUsd price}}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="text-right">Total</td>
        <td class="text-right">{{toUsd price}}</td>
      </tr>
    </tfoot>
  </table>
</template>
```

Pretty basic. Here we just have a simple `<table>` element with a bit of structure and a few references to template helpers that we'll see in a bit. First, though, we should call out to something unique here. Remember that we've defined the schema for our pizza to include a `price` field that expects a `Number` value. In expectation of a payment service—we don't include this here but it's good to practice—requiring us to deliver prices in _cents_, we've stored the price for each of our pizza's with a cents value. So, a $10 pizza is referenced as `1000` or one thousand cents.

Of course, we don't want to display `1000` in our template as that would be confusing. Instead, we've setup a template helper to convert this value to something that's a little more human friendly. Let's take a look.

<p class="block-header">/client/helpers/helpers-ui.js</p>

```javascript
UI.registerHelper( 'toUsd', function( value ) {
  return "$" + ( value / 100 );
});
```

Pretty simple, but good to see. Here, we take the value (in cents) passed to our helper and divide it by a hundred. Before we send it back to our helper, we prefix it with a `$` USD symbol. Keep in mind, this is American Arrogance at work. If we were supporting other countries, too, this would be a little more complicated and we'd likely use a [currency library](https://atmospherejs.com/lepozepo/accounting) to help us with the heavy lifting. Make sense? Cool! 

Let's look at the logic for our `orderConfirmation` template. Remember that we're using a `{{#with order}}` block helper to pipe data in, so we're actually going to look at the logic file for our `order.html` template.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.helpers({
  [...]
  order: function() {
    var currentOrder = Template.instance().currentOrder,
        type         = currentOrder.get( "type" ),
        pizza        = currentOrder.get( "pizza" ),
        price        = currentOrder.get( "price");

    if ( type !== "Custom Pizza" ) {
      var getPizza = pizza._id ? Pizza.findOne( { "_id": pizza._id } );
    } else {
      var getPizza = {
        name: "Build your custom pizza up above!",
        price: 1000
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
```
A lot going on here. Remember earlier when we defined our `ReactiveDict` and assigned it to our template instance as `this.currentOrder`? This is where it really comes into play. Here, we're creating a "summary" of our order and tweaking the information that's displayed based on our different use cases. Here, our test case is for whether or not our order is for a Custom Pizza, or one of our customer's existing pizzas or our Popular Pizzas. Let that soak in.

To test this, we call on the `type` value of our `currentOrder` variable that we set earlier as a default. Remember earlier when we set it up so that when our tab is clicked, we set the type? This is where it's used. Here, if we're _not_ building a custom pizza, we want to lookup the pizza selected in our `Pizza` collection. Wait...when did we set that? Ah! We haven't yet. Real quick, let's scroll down a bit to our `order` template's event maps to see how we're setting which pizza gets selected.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.events({
  [..]
  'click .pizza': function( event, template ) {
    template.currentOrder.set( "pizza", this );

    if ( this.custom ) {
      template.currentOrder.set( "type", "My Pizzas" );
    } else {
      template.currentOrder.set( "type", "Popular Pizzas" );
    }
  },
  [...]
});
```
This is interesting. Here, whenever an item inside our `order` template with the class `.pizza` is clicked, we want to get the data from _that template instance_ and set it equal to the `pizza` property in our ReactiveDictionary `this.currentOrder`. Because each of our pizza's is being output in an `{{#each}}` block within our `pizzaList` template, we know that `this` inside of our event handler is equal to _the data for that template_. That's confusing. Here's how it looks in action:

<figure>
  <img src="http://cl.ly/image/0e1i0e1W3T1m/data-context-example.gif" alt="Demonstration of data context changing inside of an each block.">
  <figcaption>Demonstration of data context changing inside of an each block.</figcaption>
</figure>

Make a little morse sense? So, when we click on a pizza—either a Popular Pizza or one of our customer's custom pizzas—we set the `pizza` value on our `this.currentOrder` dictionary to the data context of the _clicked_ pizza.

<div class="note">
  <h3>How is the pizza being selected? <i class="fa fa-warning"></i></h3>
  <p>We haven't covered this here, but inside of the <code>pizza</code> template that's output in our pizza list's <code>{{#each}}</code> block, we've defined an event for setting a <code>.selected</code> class when an item is clicked. To see how it works, <a href="https://github.com/themeteorchef/building-complex-forms/blob/master/code/client/templates/public/pizza.js">head over to the source</a>.</p>
</div>

Notice that in addition to setting the clicked pizza on our `this.currentOrder` dictionary, we also set the `type` value on our dictionary as well to differentiate between one of our customer's pre-made pizzas and our popular pizzas. Phew! Making sense? Let's pull back in that logic for our `orderConfirmation` template.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.helpers({
  [...]
  order: function() {
    var currentOrder = Template.instance().currentOrder,
        type         = currentOrder.get( "type" ),
        pizza        = currentOrder.get( "pizza" ),
        price        = currentOrder.get( "price");

    if ( type !== "Custom Pizza" ) {
      var getPizza = pizza._id ? Pizza.findOne( { "_id": pizza._id } ) : pizza;
    } else {
      var getPizza = {
        name: "Build your custom pizza up above!",
        price: 1000
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
```
This should be making some sense now. Depending on the different states triggered by our user's interaction with the form, we're setting the `type` and `pizza` values. This way, as our user clicks on pizzas or attempts to build a custom one, our `orderConfirmation` template updates to reflect their choices! This may take a bit of studying to fully understand, so take a few minutes to read through it and [play with the demo](http://tmc-011-demo.meteor.com).

Okay, we're getting closer. Now that we have the pieces of our form built out and wired up, we need to actually handle _placing an order_. This is pretty involved, so if need be take a quick break!

### Placing Orders
So, the final step here is actually getting an order placed. We need to do two things to get this working:

1. Validate the data we're sending to the server from the client and prevent incorrect and unwated data from hitting the server.
2. Once on the server, perform a series of inserts into our various collections on a _conditional_ basis depending on the data we've received from the client.

Let's take a look at that first part now: validating on the client.

#### Validation and form submission
We're going to start by handling the validation of our order form in the `onRendered` callback of our `order` template so we can make use of the jQuery Validation library we get access to via [Base](https://github.com/themeteorchef/base#packages-included).

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.onRendered( function() {
  [...]
  
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
	  [...]
    }
  });
});
```
Here, we begin by defining some validation rules for our order template. This may seem odd, because we're referencing values that don't actually live within our `order` template. What gives? This is one of the coolest parts about Meteor. By the time this loads up, all of our templates will be included directly into the order template, meaning, our validation can see all of those fields in the DOM! So, in turn, we can save ourselves a lot of trouble by defining our validation rules here instead of in the logic for individual teampltes.

It's important to point out that we're not actually validating every single field in our order form. What gives? Well, a few things. First, some of our field elements are optional, meaning it doesn't matter if the user does anything with them. Second, some of our field elements—like our crust selection dropdown in the pizza builder—already have a default selected, meaning the user can't "clear it out." Finally, as in the case of our pre-made pizza selections, we want to handle the validation of those items a bit differently as they don't behave like traditional form elements.

Once we've added this, if we try to submit our form we'll find that our validation kicks in and prevents our `submitHandler` from being called until all of our validation passes. Let's look at that `submitHandler` now to see how we validate things like picking a pizza as well as sending all of this to the server.

<p class="block-header">/client/templates/public/order.js</p>

```javascript
Template.order.onRendered( function() {

  var template = Template.instance();

  $( "#place-order" ).validate({
    [...]
    submitHandler: function() {
      var orderData = template.currentOrder;
          type      = orderData.get( "type" ),
          pizza     = orderData.get( "pizza" ),
          order     = {};

      if ( Meteor.user() ) {
        order.customer = Meteor.userId();
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
          email: template.find( "[name='emailAddress']").value,
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
          size: template.find( "[name='size'] option:selected" ).value,
          crust: template.find( "[name='crust'] option:selected" ).value,
          sauce: template.find( "[name='sauce'] option:selected" ).value,
          toppings: {
            meats: meatToppings,
            nonMeats: nonMeatToppings
          },
          custom: true,
          price: 10000
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

            if ( order.credentials ) {
              Meteor.loginWithPassword( order.credentials.email, order.credentials.password );
            }

            Router.go( "/profile" );
          }
        });
      }
    }
  });
});
```
Yeah, that's scary looking. It is, but we're just showing everything here so you can understand the flow. Let's break this into parts an explain each one.

```javascript
Template.order.onRendered( function() {
  var template = Template.instance();

  $( "#place-order" ).validate({
    [...]
    submitHandler: function() {
      var orderData = template.currentOrder;
          type      = orderData.get( "type" ),
          pizza     = orderData.get( "pizza" ),
          order     = {};
    }
  });
});
```
Okay. In the first part of our submission proccess, we're setting up some variables to use for later. Notice that the first three we define are all referencing our `this.currentOrder` dictionary that we setup earlier. In order to get access to this, just outside of our validation call, we create a variable `template` and assign it to `Template.instance()`. This ensures that within our `submitHandler`, we can get access to the template instance and it's data. With these in place, we can start to grab some data from our form.

#### Grabbing user data
The next thing we need to do is grab our user's data. Remember, we have to think about two states: when there's a logged in user and when there's not.

```javascript
if ( Meteor.user() ) {
	order.customer = Meteor.userId();
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
    email: template.find( "[name='emailAddress']").value,
    password: template.find( "[name='password']").value
  }
}
```
Pretty clear. First, we check if we have a current user logged in. If we do, we assign the value of `Meteor.userId()` to the `customer` property of the `order` object we defined just before this. If we _do not_ have a user, we know that we need to do two things: create a new customer document in our `Customer` collection and create a _user account_ to associate that customer document with (and, of course, let our user log in). We grab all of our customer data from our `contactInformation` template's fields and assign that to `order.customer`. Then, we grab the user's desired `email` and `password` from the `profileSignup` template and assign those to the `credentials` property in our `order` object. So far so good?

#### Handling a custom pizza
Next up, we need to handle what happens if our user wants to add a custom pizza.

```javascript
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
    size: template.find( "[name='size'] option:selected" ).value,
    crust: template.find( "[name='crust'] option:selected" ).value,
    sauce: template.find( "[name='sauce'] option:selected" ).value,
    toppings: {
      meats: meatToppings,
      nonMeats: nonMeatToppings
    },
    custom: true,
    price: 1000
  };
}
```
Again, we piggyback on our `type` value from our `this.customOrder` dictionary to see if we're building a custom pizza. If we _are_, we start by creating two empty arrays that will hold the toppings our user has checked off in the form. To actually retrieve those values, we simply use jQuery's handy `each()` method to grab all of the checkbox elements that are checked with either the name `meatTopping` or `nonMeatTopping`, pushing each into their respective arrays.

Next, we define a `customPizza` object, assigning it a mix of values: fields in the template, a `toppings` object with our two arrays assigned to nested properties, and then two additional properties `custom` and `price` which will help our app identify that this is a custom pizza and that all custom pizzas cost $10. 

#### Assigning the pizza and submitting
Last step. If you've been following along, we're building up our `order` object to include all of the possible data we'll need on the server. We'll see it in a bit, but this will help us to easily handle all of the conditions that our form presents. Before we jump to the server, we need to define one last field: our pizza.

```javascript
if ( pizza.name === "Pick a pizza!" ) {
  Bert.alert( "Make sure to pick a pizza!", "warning" );
} else {
  order.pizza = pizza._id ? pizza._id : customPizza;

  Meteor.call( "placeOrder", order, function( error, response ) {
    if ( error ) {
      Bert.alert( error.reason, "danger" );
    } else {
      Bert.alert( "Order submitted!", "success" );

      if ( order.credentials ) {
  	    Meteor.loginWithPassword( order.credentials.email, order.credentials.password );
      }

      Router.go( "/profile" );
    }
  });
}
```
Yeah! Pretty easy. First, we check if the name of our pizza is the default value we set earlier. If it _is_, we throw an error via [Bert](https://github.com/themeteorchef/bert) to let the user know they need to pick a pizza. This is our "validation" step for picking a pizza. It's pretty simple/weak, though, so your own PizzaTron 5000 may need something a little more stringent. This does the trick for now, though.

If we have a non-default pizza name, we attempt to assign our `order.pizza` value to one of two things: either the `_id` of the pizza (which means it's one of our pre-made pizzas) or our `customPizza` we setup in the last step. Once we have this, our `order` object is complete.

Last but not least, we attempt to call our `placeOrder` method! This will send our `order` object up to the server for processing. Before we hop over there, let's explain what happens when this method call is successful. We do three things, one on a conditional basis. 

First, we display an "Order submitted!" message to confirm the user's submission. Next, if our `order` object had a `credentials` field—meaning we're creating a new user—we attempt to log that user in with the `email` and `password` they gave us. At this point, we'd expect this to work as we'll be creating a user on the server with the details they gave us. Lastly, we tell our router to redirect the user to their pizza profile. Notice, that if we have a user they'll already have access to the profile. If we have a new user, because they're being logged in first, they will _also_ have access to the profile. Twofer!

Deep breaths. Let's jump up to the server and see how this all plays out. It's really neat.

### Submitting an order
This is my favorite part. In theory, this submission process is pretty tricky, right? We need to potentially create a user and insert data into multiple collections all on a conditional basis. This code is going to look like _crap_. Maybe. Maybe. Let's take a peek.

<p class="block-header">/server/methods/insert/orders.js</p>

```javascript
Meteor.methods({
  placeOrder: function( order ){
    check( order, Object );

    var handleOrder = {
      createUser: function( credentials ) {
        try {
          var userId = Accounts.createUser( credentials );
          return userId;
        } catch( exception ) {
          return exception;
        }
      },
      createCustomer: function( customer, userId ) {
        customer.userId = userId;
        var customerId  = Customers.insert( customer );

        return customerId;
      },
      createPizza: function( pizza, userId ) {
        pizza.ownerId = userId;

        var pizzaId = Pizza.insert( pizza );
        return pizzaId;
      },
      createOrder: function( userId, pizzaId ) {
        var orderId = Orders.insert({
          userId: userId,
          pizzaId: pizzaId,
          date: ( new Date() )
        });
        return orderId;
      }
    }

    try {
      var userId     = order.credentials   ? handleOrder.createUser( order.credentials )          : order.customer,
          customerId = order.customer.name ? handleOrder.createCustomer( order.customer, userId ) : null,
          pizzaId    = order.pizza.custom  ? handleOrder.createPizza( order.pizza, userId )       : order.pizza;
          orderId    = handleOrder.createOrder( userId, pizzaId );

      return orderId;
    } catch( exception ) {
      return exception;
    }
  }
});
```
F-U-N-C-T-I-O-N-A-L P-R-O-G-R-A-M-M-I-N-G! Sing it!

Although a pretty basic version of [functional programming](http://eloquentjavascript.net/1st_edition/chapter6.html), here, we try to ease our fears a bit by creating a series of methods each responsible for one of the tasks we'll need to complete. We won't dive into each of those methods because what they do is pretty simple (inserts and user creation, boring stuff). Instead, we want to call attention to _how_ we're making use of these methods on a _conditional basis_. 

#### Handling the order

Just beneath our `handleOrder` object we set up a [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) block. Inside, we put on our party hat and get totally wasted on web development. Hm. Sure, whatever you say. _Actually_, what we're doing is making use of a series of ternary operators which test the values in our `order` object passed from the server. Notice that each of these are set to a variable. 

Why? Well, except for our `customerId` step—this is where we insert a customer document in our `Customers` collection—each successive step requires some data from the one before it. By assigning the result of these checks to variables, we can return the necessary data in each of our methods up top and then pass that along to the next call. We do this all the way up until we actually create our order. Once this is complete, we've officially done the following:

1. Created a new user for our non-logged-in users or returned the currently logged in user.
2. Created a new customer for our non-logged-in users or returned nothing (technically we could add an update step here for users who change their profile data but haven't for brevity).
3. Inserted either a new custom pizza with our user's information or grabbed a reference to an existing pizza.
4. Inserted an order into our orders collection.

Hell yeah! When all is said and done, this will ensure that we've handled order placement for both logged-in and non-logged-in users. Pretty cool. At this point, we have a functioning order form. To tie this up in a little bow, though, let's add a little more data to our pizza profile: our order history and our custom pizzas.

### Filling out our profile
Last step of all the steps in the world. Hang tight. Let's open up our `pizzaProfile` template and add two new sections real quick.

<p class="block-header">/client/templates/authenticated/pizza-profile.html</p>

```markup
<template name="pizzaProfile">
  <div class="jumbotron text-center">
    <h2>Welcome aboard, pizza pilot!</h2>
    <p>Review and update your information below or blast off with a new order.</p>
    <p><a class="btn btn-success btn-lg" href="{{pathFor 'order'}}" role="button">Start an Order</a></p>
  </div>
  <h4 class="page-header">Your Orders</h4>
  {{> orders}}

  <h4 class="page-header">Custom Pizzas</h4>
  {{> Template.dynamic template="pizzaList" data=myPizzas}}

  [...]
</template>
```
Yeah? Yeah. At this point, this should look pretty familiar. We're adding two templates here: `orders` and a dynamic call to `pizzaList`. Since we've already covered how `pizzaList` works, we can read between the lines and figure out that the `myPizzas` helper we're passing to it in this dynamic include is just fetching our current user's custom pizzas. Easy peasy. Let's look at that `orders` one, though, to see how it's wired up.

<p class="block-header">/client/templates/authenticated/orders.html</p>

```markup
<template name="orders">
  {{#each orders}}
    <div class="panel panel-default pizza">
      <div class="panel-body">
        <p><strong>Date Ordered:</strong> {{date}}</p>
        {{#with pizza this.pizzaId}}
          <p><strong>Pizza</strong>: {{name}}</p>
        {{/with}}

        {{#with customer this.userId}}
          <p><strong>Sent to:</strong> {{name}}</p>
        {{/with}}
      </div>
    </div>
  {{else}}
    <p class="alert alert-info">You haven't placed any orders yet! <a href="{{pathFor 'order'}}">Start an order now</a>.</p>
  {{/each}}
</template>
```
So this is a little odd. Do the nature of how our orders are structured—they only contain references to other information—we need a way to loop through our orders, but still pull in the associated data for the items referenced by our order. How do we do it?

First, we start by looping over our orders like we would with any other list of data. Inside, though, we use `{{#with}}` helpers to grab the data we need from the other collections. Notice, too, that we define each of these with a helper name as well as passing an additional value that corresponds to a field on the currently looped order. So, for each order we get back here, we grab its `pizzaId` via `this.pizzaId` and its `userId` via `this.userId`. This may not make complete sense so let's take a peek at the logic powering it.

<p class="block-header">/client/templates/authenticated/orders.js</p>

```javascript
Template.orders.helpers({
  orders: function() {
    var getOrders = Orders.find();

    if ( getOrders ) {
      return getOrders;
    }
  },
  pizza: function( pizzaId ) {
    var getPizza = Pizza.findOne( { "_id": pizzaId } );

    if ( getPizza ) {
      return getPizza;
    }
  },
  customer: function( userId ) {
    var getCustomer = Customers.findOne( { "userId": userId } );

    if ( getCustomer ) {
      return getCustomer;
    }
  }
});
```
Hot dog, right? Notice that we can snag the values we pass in our `{{#with}}` blocks as an argument for each of our helpers. Once we have this value, we simply take it and pass it to a `findOne()` on our respective collections and get the data we need. Bond. Meteor Bond. `</lamejoke>`.

Okay...do you see what this means? We're done! Finished! Complete! Over it! Pack your bag and head to the bar becasue this was an _insane amount of work_.

Alas, we now understand how to wire up complex forms in Meteor. It wasn't the easiest thing in the world, but as we've seen, Meteor can help us simplify this process significantly.

### Wrap Up & Summary
In this recipe we learned how to create and handle complex forms. We learned how to make use of dynamic templates to reduce duplication of markup, some neats tricks involving the `ReactiveDict` package, and even learned how to use a spot of functional programming to reduce an otherwise complex process into a single method!