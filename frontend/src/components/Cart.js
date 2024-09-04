import React from 'react';

const Cart = () => {
  // This would normally be managed by state or context
  const cartItems = []; // Example placeholder

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <button>Remove from Cart</button>
            </li>
          ))
        ) : (
          <p>No items in cart.</p>
        )}
      </ul>
    </div>
  );
};

export default Cart;
