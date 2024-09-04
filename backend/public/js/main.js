const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));
app.use(morgan('dev')); 
app.use(cors()); 


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
