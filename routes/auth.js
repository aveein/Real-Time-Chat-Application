const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const authController = require('../controller/AuthController');

const { body } = require("express-validator");


// Register route
router.post('/register', [
    body('email', 'Email is Required').not().isEmpty(),
    body('name', 'Name is Required').not().isEmpty(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
    
    body('password_confirmation').custom((value, { req }) => {

        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
            }
            return true;
            
          })

],authController.registerUser);
// router.post('/register',(req,res)=>{
//     console.log(req.body)
// })

// Login route
router.post('/login',[
  body('email', 'Email is Required').not().isEmpty(),
  body('password', 'Password is Required').not().isEmpty(),
], authController.loginUser);

// Protected route (example)
router.get('/protected', authController.verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

router.get('/test', authMiddleware, async (req, resp) =>{
    resp.send({message: 'This api endpoint is protected by jwt'})
})

router.get('/',authController.verifyToken, (req, res) => {
  res.render('index')
});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
})
module.exports = router;