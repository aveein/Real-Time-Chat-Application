const express = require('express')
const router = express.Router();
var ejs = require('ejs');
const authMiddleware = require('../middleware/auth')
const path = require('path');
// router.get('/',authController.verifyToken ,(req, res) => {
//     console.log(req.session.user)
//     res.render('index')
// })
// router.get('/', (req, res) => {
//         res.render('index')
//   });
  
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const User = require('../User');
const app = express();
const server = createServer(app);
const { Op } = require("sequelize");

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

  router.get('/',authMiddleware, async(req, res) => {
    const users = await User.findAll({ where: {  [Op.not]: [
      { id: [req.session.user.id] },] } });
    const auth_user = req.session.user;

    res.render('index', {users: users,auth_user:auth_user})
  });

  router.get('/get-message',authMiddleware,async(req,res)=>{
    const user_id = req.query.user_id;
    // const view =   render('my-message');
    // res.render('my-message');

  
    var user = await User.findByPk(user_id);
   
 
    ejs.renderFile(path.join(__basedir, 'views', 'my-message.ejs'), { user: user }, (err, htmlContent) => {
      if (err) {
          console.log(err)
          return res.status(500).json({ error: "Error rendering template" });
      }

      // Send the rendered HTML as part of the JSON response
      res.status(200).json({
          message: "Here is some HTML content",
          htmlContent: htmlContent
      });
  });
  });
  
router.get('/login', function(req, res) {
    res.render('login')
})




module.exports = router;