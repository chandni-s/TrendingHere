var path = require('path');
var express = require('express')
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Authentication

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.get('/', function (req, res, next) {
    console.log("Checking session");
    console.log(req.session);
    if (!req.session.user) {
        res.status(401);
        return next();
    }
    else {
        res.status(200);
        return next();
    }
});

// serving the frontend
app.use(express.static('public'));


var dbfunctions = require('./db/db.js');
var twitter = require('./twitter.js');

// signout, signin

app.post('/api/signin/', function (req, res, next) {
    if (!req.body.username || ! req.body.pass) return res.status(400).send("Bad Request");
    dbfunctions.signin(req.body, function (signedIn) {
        if (signedIn === true) {
            req.session.user = req.body.username;
            req.session.save();
            res.cookie('username', req.body.username);
            return res.json(signedIn);
        }
        else {
            return res.status(401).send("Login failed");
        }
    });
});

// Create

app.put('/api/signup/', function (req, res, next) {
    dbfunctions.signup(req.body, function (signedUp) {
        return res.json(signedUp);
    });
});

app.post('/api/addtrend/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    console.log(req.session);
    req.body.username = req.session.user;
    dbfunctions.addTrend(req.body).then(function (fromDb) {
        if (fromDb === "Tag saved") {
            console.log("Tag save success");
            res.json("Tag save success");
            return next();
        }
    });
});

// start a new chat
app.post('/api/chat/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    req.body.username = req.session.user;
    dbfunctions.createChat(req.body, function (fromDb) {
        res.json(fromDb);
        return next();
    });
});


// READ

app.get('/api/signout/', function (req, res, next) {
    console.log("signing out");
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.end();
    });
});

// GET db tags when user signs in (recent 10 only)
app.get('/api/tags/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    dbfunctions.getDBTags().then(function (tags) {
        res.json(tags);
        return next();
    }).catch(function (err) {
        return res.status(400).end(err);
    });
});

// get tags from twitter based on location give - store them into db
app.get('/api/twitter/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    twitter.getlocationID(req.location).then(function (locationId) {
        twitter.getTrends(locationId).then(function (trendTags) {
            dbfunctions.addTrend(trendTags, function (fromDb) {
                if (fromDb === "Tag saved") {
                    console.log("Tag save success");
                    dbfunctions.getDBTags().then(function (tags) {
                        res.json(tags);
                        return next();
                    }).catch(function (err) {
                        return res.status(400).end(err);
                    });
                }
                else {
                    return res.status(400).end("Adding tag failed. Please try again");
                }
            });
        });
    });
});

// GET TAG - Search for a tag
app.get('/api/trends/search/:tagname/', function (req, res, next) {

    if (!req.session.user) return res.status(403).end("Forbidden");

    var tags = dbfunctions.searchTag(req.params.tagname);
    tags.then(function (tag) {

        if (tag.length > 0) {
            res.json(tag);
            return next();
        }
        else {
            res.json("No tags in db");
            return next();
        }

    }).catch(function (err) {
        return res.status(400).end(err);
    });
});


// Search Chats nearby: -- send back location to show points on map
app.get('/api/chats/search/nearby/:trend/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    console.log("SEARCH FOR THIS TAG in chat ....... ", req.params.trend);
    var nearByChats = dbfunctions.searchChat(req.params.trend);
    nearByChats.then(function (chats) {
        res.json(chats);
        return next();
    }).catch(function (err) {
        return res.status(400).end(err);
    });
});


// GET CHAT for trend/tag selected / Search Chats with “trend” as topic:
app.get('/api/search/trend/:trend', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    req.body.tagName = req.params.trend;
    var chats = dbfunctions.searchChat(req.params.trend);
    chats.then(function (chat) {

        res.json(chat);
        return next();

    }).catch(function (err) {
        return res.status(400).end(err);
    });
});

var geolib = require('geolib');
function checkRadius(data) {


    var radius = data.radius;
    var magnitudes = [];

    var allTags = dbfunctions.getDBTags();

    allTags.then(function (tags) {
        console.log(tags);
    }).catch(function (err) {
        console.log("Error in checking radius",err);
    });

    var distance = geolib.getDistance(
        {latitude: data1.lat, longitude: data1.long},
        {latitude: 43.5890, longitude: 79.6441},
        100);

    return true;
}


var http = require("http");

var server = http.createServer(app).listen(3000);
global.io = require('socket.io').listen(server);
console.log('HTTP on port 3000');
require('./socket.js');

module.exports = app;