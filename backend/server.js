const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db'); // Configuración de Sequelize

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(morgan('dev')); // Log requests to the console
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/products', productRoutes); // Route for product-related endpoints
app.use('/api/users', userRoutes); // Route for user-related endpoints

// Route for the homepage or default route
app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce API!');
});

// Connect to the database and start the server
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
