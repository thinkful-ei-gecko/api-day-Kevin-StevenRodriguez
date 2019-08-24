/* eslint-disable no-unused-vars */
/* global store, api */
'use strict';

const shoppingList = (function() {
  function generateItemElement(item) {
    const checkedClass = item.checked ? 'shopping-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';
    let itemTitle = `<span class="shopping-item ${checkedClass}">${item.name}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item" type="text" value="${item.name}" />
        </form>
      `;
    }
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-edit js-item-edit" ${editBtnStatus}>
            <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function renderError() {
    if (store.error) {
      $('.js-display-error').html(`
        <button id="close-error">X</button>
        <p>${store.error}</p>
      `);
    }
    else {
      $('.js-display-error').empty();
    }
  }
  
  function render() {
    renderError();

    let items = [ ...store.items ];

    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    } 

    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
 
    const shoppingListItemsString = generateShoppingItemsString(items);
    $('.js-shopping-list').html(shoppingListItemsString);
  }
   
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      api.createItem(newItemName)
        .then(newItem => {
          store.addItem(newItem);
          render();
        })
        .catch(err => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function getItemIdFromElement(item) {
    return $(item).closest('.js-item-element').data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);    
      api.getItemById(id)
        .then(() => {
          api.updateItem(id, { checked: !store.findById(id).checked })
            .then(() => {
              store.findAndUpdate(id, { checked: !store.findById(id).checked });
              render();
            });
        })
        .catch(err => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteItem(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch(err => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      api.updateItem(id, { name: itemName })
        .then(() => {
          store.findAndUpdate(id, { name: itemName });
          store.setItemIsEditing(id, false);
          render();
        })
        .catch(err => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }

  function handleCloseError() {
    $('.js-display-error').on('click', '#close-error', () => {
      store.setError(null);
      renderError();
    })
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleItemStartEditing();
    handleCloseError();
  }

  return {
    render,
    bindEventListeners
  };
}());
