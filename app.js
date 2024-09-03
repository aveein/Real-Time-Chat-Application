
const session = require('express-session')
const express = require('express');

const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const app = express();
const MySQLStore = require('express-mysql-session')(session);
const PORT = 3001;

const options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'chat'
};


const sessionStore = new MySQLStore(options);

app.use(express.static(__dirname + '/public'));

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

app.use('/auth',authRoute);
app.use('/',route);

app.listen(PORT, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});


module.exports =app;

