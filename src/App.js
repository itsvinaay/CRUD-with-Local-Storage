import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ id: null, name: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items'));
    if (storedItems) setItems(storedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    item.id = items.length ? items[items.length - 1].id + 1 : 1;
    setItems([...items, item]);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setEditing(false);
  };

  const editItem = (item) => {
    setEditing(true);
    setCurrentItem(item);
  };

  return (
    <div className="App">
      <h1>CRUD with Local Storage</h1>
      <div>
        {editing ? (
          <EditItemForm
            currentItem={currentItem}
            setEditing={setEditing}
            updateItem={updateItem}
          />
        ) : (
          <AddItemForm addItem={addItem} />
        )}
      </div>
      <ItemList items={items} deleteItem={deleteItem} editItem={editItem} />
    </div>
  );
}

function AddItemForm({ addItem }) {
  const initialFormState = { id: null, name: '' };
  const [item, setItem] = useState(initialFormState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!item.name) return;
    addItem(item);
    setItem(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={item.name}
        onChange={handleInputChange}
      />
      <button>Add new item</button>
    </form>
  );
}

function EditItemForm({ currentItem, setEditing, updateItem }) {
  const [item, setItem] = useState(currentItem);

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateItem(item);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={item.name}
        onChange={handleInputChange}
      />
      <button>Update item</button>
      <button onClick={() => setEditing(false)}>Cancel</button>
    </form>
  );
}

function ItemList({ items, deleteItem, editItem }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length > 0 ? (
          items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <button onClick={() => editItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No items</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default App;
