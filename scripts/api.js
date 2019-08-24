/* eslint-disable no-unused-vars */
/* global cuid, store */
'use strict';

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kevin-stevenR';

  function fetchSpecial(...args) {
    let error;
    return fetch(...args)
      .then(response => {
        if (!response.ok) {
          error = { code: response.status };
          if (!response.headers.get('content-type').includes('json')) {
            error.message = response.statusText;
            return Promise.reject(error);
          }
        }
        return response.json();
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        } 
        return data;
      })
      .catch(error => store.setError(error));
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