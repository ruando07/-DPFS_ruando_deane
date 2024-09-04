
const Product = require('../models/product');


exports.createProduct = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const product = await Product.create({ name, description, image });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.image = image || product.image;
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
