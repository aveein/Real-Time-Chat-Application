const sequelize = require('./db');
const Message = require('./Message');
const User = require('./User');
const bcrypt = require('bcryptjs');

// Sync the database and create a sample user
(async () => {
  try {
    
    await sequelize.sync(); // This will create the tables based on the models
    // await sequelize.sync({ force: true }); // This will create the tables based on the models
    console.log('Database synced!');
    const count = await User.count();
    if(count === 0){
    // Create a new user
    const newUser = await User.create({
      name: 'Jane Doe',
      email: 'demo@example.com',
      password: bcrypt.hashSync('password', 8),
 
    });
    const newUser2 = await User.create({
      name: 'Test',
      email: 'test1@gmail.com',
      password: bcrypt.hashSync('test@123', 8),
 
    });

    const message = await Message.create({
      message: 'Test',
      from_id: 1,
      to_id: 2,
      
 
    });
    
    console.log('User created:', newUser.toJSON());
    }

  } catch (error) {
    console.error('Error syncing the database:', error);
  } finally {
    await sequelize.close();
  }
})();
