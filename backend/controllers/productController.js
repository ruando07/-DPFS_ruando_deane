const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const productsController = {
    list: (req, res) => {
        res.render('products/productList', { products });
    },

   
    createForm: (req, res) => {
        res.render('products/createProduct');
    },

    create: (req, res) => {
        const newProduct = {
            id: products.length + 1,
            ...req.body
        };
        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.redirect('/products');
    },


    detail: (req, res) => {
        const product = products.find(p => p.id == req.params.id);
        if (product) {
            res.render('products/productDetail', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },


    editForm: (req, res) => {
        const product = products.find(p => p.id == req.params.id);
        if (product) {
            res.render('products/editProduct', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },


    update: (req, res) => {
        const productIndex = products.findIndex(p => p.id == req.params.id);
        if (productIndex !== -1) {
            products[productIndex] = { id: req.params.id, ...req.body };
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
            res.redirect(`/products/${req.params.id}`);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },

    
    delete: (req, res) => {
        products = products.filter(p => p.id != req.params.id);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.redirect('/products');
    }
};

module.exports = productsController;
