const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { body, validationResult } = require("express-validator");
const User = require('../User');



// Secret key for JWT (keep this safe)
const JWT_SECRET = 'mysecret';

// Register a new user
const registerUser = async(req, res) => {
  
  
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // in case request params meet the validation criteria
      return res.status(422).json({errors: errors.array()})

    }
  const { email,name, password } = req.body;


  // Check if user already exists
  const userExists = await User.findOne({ where: { email: email } });
  
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Create a new user and store it
  const newUser = { password:hashedPassword,name,email  };
//   res.send(newUser);
  

  const user = await User.create(newUser);
  res.status(201).json({ message: 'User registered successfully' });
};

// Authenticate a user and generate a JWT
const loginUser =  async (req, res) => {
  const { email, password } = req.body;
    console.log(email)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // in case request params meet the validation criteria
    return res.status(422).json({errors: errors.array()})

  }


  // Find the user by username
  try {
    
    
    const user =   await User.findOne({where:{ email: email }})



    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
    expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }


};

// Middleware to protect routes
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = { registerUser, loginUser, verifyToken };
