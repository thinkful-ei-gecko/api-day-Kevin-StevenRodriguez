'use strict';
/* global shoppingList, store, api */

$(document).ready(function() {
  shoppingList.bindEventListeners();
  api.getItems() // fetch all items
    .then(res => res.json()) // parse response
    .then((items) => {
      items.forEach((item) => store.addItem(item)); // for each item in the response, add it to store
      shoppingList.render(); // render whole shopping list
    });
});