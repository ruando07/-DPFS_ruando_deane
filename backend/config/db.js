const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce_db', 'ruando07', 'Ru@nd01997', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, 
    define: {
      timestamps: false 
    }
  });
  sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
  

module.exports = sequelize;