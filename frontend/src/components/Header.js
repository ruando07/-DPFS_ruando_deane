import React from 'react';

const Header = () => {
  return (
    <header>
      <h1>E-Commerce Site</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  );
};

export default Header;
