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
