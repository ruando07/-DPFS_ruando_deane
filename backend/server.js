const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db'); 

const app = express();
const port = process.env.PORT || 3001;


app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 


app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce API!');
});


sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
