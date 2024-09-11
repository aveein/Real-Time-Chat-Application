
const session = require('express-session')
const express = require('express');

const bodyParser = require('body-parser');





const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('dotenv').config()
const flash = require('connect-flash');

var config = process.env

const hostname = config.HOSTNAME;

const MySQLStore = require('express-mysql-session')(session);

const PORT = 3000;




const options = {
	host: config.DB_HOST,
	port: 3306,
	user: config.DB_USERNAME,
	password: config.DB_PASSWORD,
	database: config.DB_DATABASE
};


const sessionStore = new MySQLStore(options);

app.use(express.static(__dirname + '/public'));

global.__basedir = __dirname;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const authRoute = require('./routes/auth');
const route = require('./routes/route');


app.use(session({
  secret: 'keyboard cat',
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false ,  maxAge: 600000 }
}))

app.use(
  flash()
);
app.use('/auth',authRoute);
app.use('/',route);

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;

//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.userID = 
//   socket.username = username;
//   next();
// });




io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const id = socket.handshake.auth.id;

  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.userID = id;
  socket.id = socket.id;

  next();
});


io.on('connection', (socket) => {

  console.log('a user connected');
 
  socket.join(socket.userID);

  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: socket.userID,
      username: socket.username,
      id: socket.id,
    });
  }
  socket.emit("users", users);

  socket.on("private message", ({ content, to }) => {

    
      socket.to(to).to(socket.userID).emit("private message", {
        content,
        from: socket.userID,
        to
      });
    });
});



server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


module.exports =app;

