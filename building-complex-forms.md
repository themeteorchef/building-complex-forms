### Getting Started
To get started, let's add all of the packages that we'll need for this recipe. Don't worry, as we move through the recipe we'll see how these come into play.

<p class="block-header">Terminal</p>

```bash
meteor add aldeed:collection2
```
We'll rely on the [`aldeed:collection2`]() package to help us add schemas to our Meteor collections. This will help us control how and what data is allowed into our collections.

<p class="block-header">Terminal</p>

```bash
meteor add reactive-dict
```
We'll use the [`reactive-dict`]() package to help us control form state and make it a little easier to access the data in our forms.

<div class="note">
  <h3>Additional Packages <i class="fa fa-warning"></i></h3>
  <p>This recipe relies on several other packages that come as part of <a href="https://github.com/themeteorchef/base">Base</a>, the boilerplate kit used here on The Meteor Chef. The packages listed above are merely recipe-specific additions to the packages that are included by default in the kit. Make sure to reference the <a href="https://github.com/themeteorchef/base#packages-included">Packages Included list</a> for Base to ensure you have fulfilled all of the dependencies.</p>
</div>

### What are we building?
Generally speaking, most forms in our applications are pretty simplistic. This is fine, but sometimes we need to build more complex forms. Forms that rely on multiple templates, have different variations of user input, and other features that require a little more work on that part. To help wrap our head around what it takes to develop complex forms in Meteor, we're going to build a simple application for a pizzeria called [Pizza Planet](https://www.youtube.com/watch?v=DAI5wUZ3k5Q).

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
Customers = new Meteor.Collection( 'customers' );
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

To add schemas to our collections, we're going to rely on the `aldeed:collection2` package that we installed a little bit ago. This package allows us to design a set of rules for how documents being inserted into a collection should look. We define these rules on a _per field basis_. Each field can have a handful of settings. Let's see what it looks like to add a schema and then walk through the rules for each.

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

So, notice that we're planning on having a field in each of our customer documents called `name`. Using the [options given to use by collection2](), we've created a rule for this field that:

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

[SimpleSchema]() is another package by the author of collection2 that gives us the actual syntax for defining schemas along with the methods to actually _validate_ that data. collection2, then, is best thought of as a more user-friendly wrapper around SimpleSchema that automates the validation of data by automatically applying it to a collection. We can see this happening in the example above on the last line `Orders.attachSchema( OrdersSchema )`. 

This is taking the schema we've defined above it—assigned to the `OrdersSchema` variable—and "attaching" it to our `Orders` collection. Notice, this is just calling a method `attachSchema` that has been added by collection2 to our MongoDB collection definition. Neat! 

With this in place, all of the data that we attempt to insert into our collection will be validated against this schema before we allow the insert. That's it. Nice, eh? Real quick, let's take a look at our last collection `Pizza` and see how it's schema is taking shape.

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
This one has a few more fields with slightly less obvious settings on some fields. Let's call attention to one of our field definitions: `toppings.meats`. This field has a weird type of `[ String ]`. Here, this means that we expect the value of `toppings.meats` to be equal to an _array_ of strings. This syntax is a bit odd, I know. Notice, too, that we're defining this field off a parent object `toppings`. Why don't we have to add a rule for that?

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
      Pizza.find(),
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
Not _too_ crazy. First, we give our publication a simple name to identify where it will be used, in this case the `order` form. Inside, we start by grabbing hte current user's ID. Remember, [we have access to this from inside publications](http://themeteorchef.com/snippets/publication-and-subscription-patterns/#tmc-simple-publications) as an added security-minded bonus. Next, if we have a logged in user, we create a new variable `data` and assign it to an array with two methods inside: `Pizza.find( { $or: [ { "custom": true, "ownerId": user }, { "custom": false } ] } )` and `Customers.find( { "userId": user } )`. Together, these two calls make up all of the data that we'll need on the order form screen _when a user is logged in_.  

That first one is pretty gnarly. What's that `{ $or ... }` business? This is pretty neat. Here, we can perform "multiple queries" on the same collection using a single call. Using the [MongoDB `$or` operator](), we can ask MongoDB to give us all of the documents that match different queries. We can pass our separate queries in array and get back a single cursor with the documents matching either query. Wow! This is handy because if we tried to pass two `Pizza.find()` calls in this array with our different queries, we'd get an error. 

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

Notice, each of these pizzas follows our schema by the book. This is intentional. Below when we go to insert pizza's into our collection, behind the scenes our schema will be called against each of these pizza's. Remember, if our data doesn't meet our schemas criteria, it's getting kicked to the curb by collection2.

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

<p class="block-header"></p>

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
What in the heck is this Jetson's business? Hang in there. To explain, we want to be as economical as possible with our templates. As we'll see later on, we'll need access to our `contactInformation` in our order form, too. Instead of recreating the exact same template twice, we can use Meteor's handy `{{> template.dynamic}}` feature to use our template in different contexts (i.e. different features in different places using the same template). Strap in!

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

<p class="block-header">/client/templates/public/</p>

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
Remember earlier when we showed the home page for our app that we also had a "Start an Order" button, too? Let's get that thing wired up. Take a deep breath, we're going to cover a lot in just a little bit of time. You'll be a different person by the time you finish reading. Ready?

#### Adding the category tabs
Recall earlier that we outlined three possible types of orders our user will be able to place:

1. A custom pizza that they saved from an earlier visit.
2. A pre-made, "Popular Pizza" that already has it's toppings picked out.
3. A new custom pizza.

To handle this, we're going to create a tabbed interface that allows our users to switch between these three types orders, tracking their movement in the UI so we know which type of order is being placed. To start, let's look at the markup for our order form to see how these tabs will fit in.

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

Here, we're trying to cover two scenarios. First, if we have a logged in user, we want to show them their previously created pizzas, so we make this tab available if a `currentUser` is available. Additionally, we also pull in the Popular Pizza's tab here. Why? Notice that if the "My Pizzas" tab is available, _that tab_ should an `.active` CSS class. If it's not available, then we'd want our "Popular Pizzas" tab to be active as it moves into the first position if "My Pizzas" isn't there. This is purely cosmetic and for UX-sake, but good to point out. Real quick, notice that extra `data-pizza-type` attribute we're setting on each `<li>`?

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

Cool. So, just after set our dictionary up, we also set some initial values on it. Here, we're setting a `type` and `pizza` value. The `type` value here is simply saying that the _type_ of order by default will be "My Pizzas" if there's a current user, or "Popular Pizzas" if there is not (this accounts for our `currentUser` tab switching from a little bit ago). That "pizza" setting right now is just for show. That will be used to display some default values later on. For now, just know that we've set it.

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
Back in our `pizzaCategories` template, we can see this technique being used fir both our `myPizzas` and `popularPizzas` data sources. How cool is that? Using a single template, we get the same styles but pipe in different data. Polish off that Swiss Army Knife.

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
Despite it sounding like a really complicated step, our `buildPizza` template is actually quite simplistic. It's got a few form fields, some dropdown lists, but nothing that wild. Hm. The tricky party with this will come later when we need to get these values _back_. For now, let's talk about how this template is getting it's data.

#### Default values in settings.json
As part of our ordering process, customers will be able to build a custom pizza. In order to facilitate this process, we need a way to give them all of the "parts" of a pizza. To do this, we can store some basic data in our [settings.json file](themeteorchef.com/snippets/making-use-of-settings-json). 

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

### Placing Orders
#### Defining a modular function
#### Handling the order

### Filling out our profile

#### Showing the order confirmation