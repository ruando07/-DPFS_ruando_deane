const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/authMiddleware');


const jwtSecret = process.env.JWT_SECRET || 'supersecretkey';


router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});


router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});


router.post('/products', authMiddleware, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const newProduct = await Product.create({ name, description, price, imageUrl });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
});


router.put('/products/:id', authMiddleware, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await product.update({ name, description, price, imageUrl });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});


router.delete('/products/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await product.destroy();
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});


router.post('/register',
    [
        body('email').isEmail().withMessage('El email no es válido'),
        body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
        body('name').notEmpty().withMessage('El nombre es requerido'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });

            const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '1h' });

            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario', error });
        }
    }
);


router.post('/login',
    [
        body('email').isEmail().withMessage('El email no es válido'),
        body('password').notEmpty().withMessage('La contraseña es requerida'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'Email o contraseña incorrectos' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Email o contraseña incorrectos' });
            }

            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al iniciar sesión', error });
        }
    }
);


router.post('/cart/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ where: { userId, productId } });

        if (cart) {
            cart.quantity += quantity;
            await cart.save();
        } else {
            cart = await Cart.create({ userId, productId, quantity });
        }

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
    }
});

router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findAll({ where: { userId: req.user.id }, include: Product });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});


router.delete('/cart/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ where: { userId, productId } });

        if (!cart) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        await cart.destroy();
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
});

module.exports = router;
