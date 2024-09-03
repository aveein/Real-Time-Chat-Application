const express = require('express')
const router = express.Router();

const authMiddleware = require('../middleware/auth')

// router.get('/',authController.verifyToken ,(req, res) => {
//     console.log(req.session.user)
//     res.render('index')
// })
// router.get('/', (req, res) => {
//         res.render('index')
//   });
  
  router.get('/',authMiddleware, (req, res) => {
    res.render('index')
  });
  
router.get('/login', function(req, res) {
    res.render('login')
})




module.exports = router;