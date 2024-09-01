const sequelize = require('./db');
const User = require('./User');
const bcrypt = require('bcryptjs');

// Sync the database and create a sample user
(async () => {
  try {
    await sequelize.sync({ force: true }); // This will create the tables based on the models
    console.log('Database synced!');

    // Create a new user
    const newUser = await User.create({
      name: 'Jane Doe',
      email: 'demo@example.com',
      password: bcrypt.hashSync('password', 8),
 
    });
    
    console.log('User created:', newUser.toJSON());
  } catch (error) {
    console.error('Error syncing the database:', error);
  } finally {
    await sequelize.close();
  }
})();
