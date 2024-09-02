const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';

const app = express();
const PORT = 3001;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const authRoute = require('./routes/auth');
const route = require('./routes/route');

app.use('/',route);
app.use('/auth',authRoute);
app.listen(PORT, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});


