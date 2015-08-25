Template.buildPizza.helpers({
  crusts: function(){
    return Meteor.settings.public.crusts;
  },
  sauces: function(){
    return Meteor.settings.public.sauces;
  },
  toppings: function(){
    return Meteor.settings.public.toppings;
  }
});
