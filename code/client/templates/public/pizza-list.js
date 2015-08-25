Template.pizzaList.helpers({
  isProfile: function() {
    var templateData = Template.instance().data;
    return templateData.context === "profile" ? true : false;
  },
  currentList: function() {
    return Template.instance().data;
  },
  pizzas: function() {
    // Convert our context from a MongoDB cursor to an array using .fetch()
    // so we can easily modify it below.
    var data = Template.instance().data.content.fetch();

    // Because we're using this pizzas helper to enumerate our list of pizzas
    // and we're passing that data *to* our {{> pizza}} template, we need a
    // way to let the {{> pizza}} template know about the context (for toggling
    // functionality on/off). This tricky little bit allows us to pass that data
    // along with each pizza! Here, we simply update each element with a context
    // value before it's passed to the template.
    for ( var pizza in data ) {
      data[ pizza ].context = Template.instance().data.context;
    }

    if ( data ) {
      return data;
    }
  }
});
