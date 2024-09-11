const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { body, validationResult } = require("express-validator");
const User = require('../User');

const config = require('../config');
const { head } = require('../routes/route');

// Secret key for JWT (keep this safe)
const JWT_SECRET = config.secret;


// Register a new user
const registerUser = async(req, res) => {
  
  
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // in case request params meet the validation criteria
      req.flash(errors, errors.array())
      return redirect('/login');
      // return res.status(422).json({errors: errors.array()})

    }
  const { email,name, password } = req.body;


  // Check if user already exists
  const userExists = await User.findOne({ where: { email: email } });
  
  if (userExists) {
    req.flash('message', ['User already exists', 'danger']);
    return res.redirect('/login');
    // return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Create a new user and store it
  const newUser = { password:hashedPassword,name,email  };
//   res.send(newUser);
  

  const user = await User.create(newUser);
  // res.status(201).json({ message: 'User registered successfully' });
  res.redirect('/login')
};

// Authenticate a user and generate a JWT
const loginUser =  async (req, res) => {
  const { email, password } = req.body;
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // in case request params meet the validation criteria
    return res.status(422).json({errors: errors.array()})

  }


  // Find the user by username
  try {
    
    
    const user =   await User.findOne({where:{ email: email }})



    if (!user) {
      // return res.status(401).json({ error: 'Authentication failed' });
       req.flash('message', ['Authentication failed', 'danger']);
     
       return res.redirect("/login");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user.id }, config.secret, {
        expiresIn: '3h',
        });
        console.log(token)
      req.session.token = token;
    
      req.session.user = {id:user.id,email:user.email,name: user.name};

      console.log(req.session.user);
      res.redirect('/');

    } catch (error) {
      console.log(error)
    res.status(500).json({ error: 'Login failed', message: error });
    }


};

// Middleware to protect routes
const verifyToken = (req, res, next) => {
  const header = req.session.token;
  console.log(config.secret,header);
  if (!header) {
    return res.status(403).json({ message: 'No token provided' });
  }
  



  try {
    const decodedUser = jwt.verify(header, config.secret);
    req.user = decodedUser;
    next();
    }catch(error) {
      
        return res.status(400).send({message: 'Invalid token..'});
    }
};


module.exports = { registerUser, loginUser, verifyToken };
