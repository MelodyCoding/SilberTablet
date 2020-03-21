
var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pictures', function(req, res) {
    res.sendFile(path.join(__dirname + '/indexWithPictures.html'));
});

app.get('/demo', function(req, res) {
    res.sendFile(path.join(__dirname + '/demo.html'));
});

app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log("Server running at http://localhost:%d", port);
