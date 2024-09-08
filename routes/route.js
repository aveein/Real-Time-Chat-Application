const express = require('express')
const router = express.Router();

const authMiddleware = require('../middleware/auth')

const MessageController =require('../controller/MessageController')
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

  router.get('/get-user-detail',authMiddleware, async(req, res) => {
   
    const user = req.session.user;

    res.json(user)
  });

  router.get('/get-user-detail-by-id/:id',authMiddleware, MessageController.getUserDetail);

   router.post('/post-message',authMiddleware,MessageController.postMessage);


  router.get('/get-message',authMiddleware,MessageController.getMessage);

  router.get("/get-search",authMiddleware,MessageController.searchUser);
  


router.get('/login', function(req, res) {
    res.render('login')
})




module.exports = router;