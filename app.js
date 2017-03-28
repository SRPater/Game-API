var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/BookAPI');

var Game = require('./models/gameModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

bookRouter = require('./routes/gameRoutes')(Game);

app.use(function(req, res, next) {
    // res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

app.use('/api/games', bookRouter);

app.get('/', function(req, res) {
    res.send('Welcome to my API!');
});

app.listen(port, function() {
    console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;
