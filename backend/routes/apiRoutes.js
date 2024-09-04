const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    await Cart.create({ userId, productId, quantity });
    res.status(201).send('Product added to cart');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ where: { userId: req.params.userId } });
    res.json(cartItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
