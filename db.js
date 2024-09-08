const { Sequelize } = require('sequelize');

// Set up the Sequelize instance
require('dotenv').config()

var config = process.env

const sequelize = new Sequelize(
    config.DB_DATABASE,
    config.DB_USERNAME,
    config.DB_PASSWORD,
     {
       host: config.DB_HOST,
       dialect: 'mysql'
     }
   );
 
 sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

module.exports = sequelize;