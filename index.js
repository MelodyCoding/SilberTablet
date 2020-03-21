// Development Server?
const devel = true;

var express = require('express');
var app = express();
var path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
var uuid = require("uuid");

db.defaults({sessions: []}).write();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/demo', function (req, res) {
    res.sendFile(path.join(__dirname + '/demo.html'));
});

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});

//Die Haupt-Anwendung
app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname + '/app.html'));
});

//Anruf starten
app.get('/call', function (req, res) {
    res.sendFile(path.join(__dirname + '/call.html'));
});

//Anruf beitreten
app.get('/join', function (req, res) {
    res.sendFile(path.join(__dirname + '/join.html'));
});


app.get('/api/create-dial-in-code', function (req, res) {
    //Einen zufälligen Dial-In-Code erzeugen
    var code = Math.random().toString(36).substring(6);

    //Gibt es den Code schon?
    while (db.get('sessions').find({'dial-in-code': code}).value() != undefined) {
        code = Math.random().toString(36).substring(6);
    }

    //Raumnamen und Raumkennwort erzeugen
    var _room_name = 'silbertablet_' + Date.now() + "_" + uuid.v4();
    var _password = Math.random().toString(36).substring(6);

    //Daten in der LowDB Speichern
    db.get('sessions').push({dial_in_code: code, room_name: _room_name, password: _password}).write();

    //Dial-In-Code zurückgeben
    var response = {
        'status': '200',
        'data': {
            'dial_in_code': code
        }
    }

    res.send(response);
});

app.get('/api/dial-in-code/:code', function (req, res) {
    //Den Raumnamen und das Raumkennwort für einen Dial-In-Code zurückgeben

    var code = req.params.code;
    var session = db.get('sessions').find({dial_in_code: code}).value();

    if (session == undefined) {
        var response = {
            'status': '404'
        }
    } else {
        var response = {
            'status': '200',
            'data': session
        }
    }

    res.send(response);
});

if (devel) {
    const port = process.env.PORT || 8080;
    app.listen(port);

    console.log("Server running at http://localhost:%d", port);
} else {
    // Certificate
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/silbertablet.org/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/silbertablet.org/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/silbertablet.org/chain.pem', 'utf8');
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    // Starting both http & https servers
    const httpServer = http.createServer(function (req, res) {
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
    });
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });

    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
}