var socket = require('socket.io');
var dbfunctions = require('./db/db.js');
var twitter = require('./twitter.js');

global.io.on('connection', function(socket){
    console.log("client connected: " + socket.id);


    socket.on('location-id', function (location) {
        var twtrends = [];
        var loc = twitter.getlocationID(location);
        loc.then(function (id) {
            twitter.getTrends(id).then(function (tags) {
                tags.forEach(function (tag) {
                    dbfunctions.addTag(tag.name).then(function (fromDB) { // adding twitter tags to db
                        dbfunctions.getDBTags().then(function (tags) {
                            socket.emit('db-tags', tags);
                        });
                    });
                });
            });
        }).catch(function(err){
            console.log(err.message);
        });
    });


    socket.on('search-tag', function (tag) {
        var tagresults = dbfunctions.searchTag(tag);
        tagresults.then(function (tags) {
            socket.emit('db-tags', tags);
        }).catch(function(err){
            console.log(err.message);
        });
    });

    socket.on('get-db-tags', function () {
        var tags = dbfunctions.getDBTags();
        tags.then(function (tag) {
            socket.emit('tagsfromdb', tag);
        }).catch(function(err){
            console.log(err.message);
        });
    });

    socket.on('send-message', function(msg){
        var savemsg = dbfunctions.saveChatMsg(msg);
        savemsg.then(function (fromdb) {
            socket.broadcast.emit('receive-message', msg);
        }).catch(function(err){
            console.log(err.message);
        });
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


}); //socket io connection