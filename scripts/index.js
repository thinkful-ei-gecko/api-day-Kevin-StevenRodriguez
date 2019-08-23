'use strict';
/* global shoppingList, store, Item, api */
// eslint-disable-next-line no-unused-vars
$(document).ready(function() {
  shoppingList.bindEventListeners();
  api.getItems() // fetch all items
    .then(res => res.json()) // parse response
    .then((items) => {
      items.forEach((item) => store.addItem(item)); // for each item in the response, add it to store
      shoppingList.render(); // render whole shopping list
    });

  api.getItems()
    .then(res => res.json())
    .then((items) => {
      const item = items[0];
      return api.updateItem(item.id, { name: 'foobar' });
    })
    //.then(res => res.json())
    .then(() => console.log('updated!'));
});