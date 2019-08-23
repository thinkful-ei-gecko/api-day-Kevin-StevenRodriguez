'use strict';

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kevin-stevenR';

  function getItems() {
    //return Promise.resolve('A successful response!');
    return fetch(`${BASE_URL}/items`);
  }

  function getItemById(id) {
    return fetch(`${BASE_URL}/items/${id}`);
  }

  function createItem(name) {
    const newItem = JSON.stringify({ name });
    return fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newItem
    });
  }

  function updateItem(id, updateData) {
    const patchData = JSON.stringify( updateData );
    return fetch(`${BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: patchData
    });
  }

  return {
    getItems,
    getItemById,
    createItem,
    updateItem
  };
}());