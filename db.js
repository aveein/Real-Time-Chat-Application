const { Sequelize } = require('sequelize');

// Set up the Sequelize instance
const sequelize = new Sequelize(
    'chat',
    'root',
    '',
     {
       host: 'localhost',
       dialect: 'mysql'
     }
   );
 
 sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

module.exports = sequelize;