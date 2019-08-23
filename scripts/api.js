/* eslint-disable no-unused-vars */
/* global cuid */
'use strict';

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kevin-stevenR';

  function fetchSpecial(...args) {
    let error;
    return fetch(...args)
      .then(response => {
        if (!response.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!
          error = { status: response.status, statusText: response.statusText };
        }

        // In either case, parse the JSON stream:
        return response.json();
      })
      .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
  
        // Otherwise give back the data as resolved Promise
        return data;
      });
  }

  function getItems() {
    return fetchSpecial(`${BASE_URL}/items`);
  }

  function getItemById(id) {
    return fetchSpecial(`${BASE_URL}/items/${id}`);
  }

  function createItem(name) {
    const newItem = JSON.stringify({ id: cuid(), name, checked: false });
    return fetchSpecial(`${BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newItem
    });
  }

  function updateItem(id, updateData) {
    const patchData = JSON.stringify( updateData );
    return fetchSpecial(`${BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: patchData
    });
  }

  function deleteItem(id) {
    return fetchSpecial(`${BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
  };
}());