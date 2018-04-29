var crypto = require('crypto');
var app = require('../server');

var mongoose = require('mongoose');
var User = require('./model.js');

// mongodb://admin:1234@ds141490.mlab.com:41490/trendinghere
var db = 'mongodb://admin:1234@ds141490.mlab.com:41490/trendinghere';
mongoose.connect(db);


// Authentication

var bcrypt = require('bcryptjs');
function createPassword (user, next) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) console.log(err);
        else {
            bcrypt.hash(user.pass, salt, function (err, hash) {
                if (err) console.log(err);
                else {
                    user.pass = hash;
                    return next(user);
                }
            });
        }
    });
}

function checkpassword(userpassword, hash, next) {
    bcrypt.compare(userpassword, hash, function(err, res) {
        if (err) return next(err);
        else {
            console.log("match or nah",res);
            return next(res);
        }
    });
}

function signup(req, next) {
    var newuserdb = new User.UserSchema();
    createPassword(req, function (newuser) {
        User.UserSchema.findOne({"username": newuser.username}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                return next("Username " + req.username + " already exists");
            }
            else {
                newuserdb.username = newuser.username;
                newuserdb.password = newuser.pass;
                newuserdb.save(function (err, user) {
                    if (err) return next(err);
                    return next(user);
                });
            }
        });
    });
}


function signin(req, next) {
    User.UserSchema.findOne({"username": req.username}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next("User not found");
        }
        else {
            checkpassword(req.pass, user.password, function (isMatch) {
                if (isMatch) {
                    return next(isMatch);
                }
                else {
                    return next("Unauthorized user");
                }
            });
        }
    });
}

function createChat(req, next) {
    var newchat = new User.chatSchema();
    User.chatSchema.findOne({chatname: req.chatname}, function (err, chat) {
        if (err) {
            return next(err);
        }
        if (chat) {
            return next("Chat name " + req.chatname + " already exists. Please choose a new name");
        }
        else {
            newchat.chatname = req.chatname;
            newchat.username = req.username;
            newchat.tags = req.tags;
            newchat.long = req.long;
            newchat.lat = req.lat;
            newchat.description = req.description;

            newchat.save(function (err, chat) {
                if (err) return next(err);
                else {
                    chat.tags.forEach(function (tag) {
                        var updatetags = new User.tagsSchema();
                        updatetags.tagname = tag;
                        updatetags.long = chat.long;
                        updatetags.lat = chat.lat;
                        updatetags.username = chat.username;
                        updatetags.save(function (err, tagsaved) {
                            if (err) return next("Tag update in chat creation failed ", err);
                            return next(chat);

                        });
                    });
                }
            });
        }
    });
}

function addTrend(data) {
    console.log("Got into adding trend", data);
    var tag = new User.tagsSchema();
    if (data.username) {
        tag.username = data.username;
    } else {
        tag.username = ''; // tags came from twitter
    }

    tag.tagname = data.name;
    tag.long = data.long;
    tag.lat = data.lat;
    return new Promise(function (resolve, reject) {
        tag.save(function (err) {
            if (err) return reject(err);
            return resolve("Tag saved");
        });
    });
}

function searchTag(tag) {
    return new Promise(function (resolve, reject) {
        User.tagsSchema.find({tagname:tag}, function (err, data) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else {
                console.log("DATA FROM SEARCH TAG DB....",data);
                return resolve(data);
            }

        });
    });
}

function searchChat(tag) {
    console.log("Search tag CHAT Schema ", tag);
    return new Promise(function (resolve, reject) {


        User.chatSchema.find({ tags: {"$in" : [tag]} }, function (err, data) {
            if (err) return reject(err);
            else {
                console.log(data);
                return resolve(data);
            }
        });
    });
}

function saveChatMsg(data) {
    var msgObject = new User.msgSchema();
    msgObject.username = data.username;
    msgObject.msg = data.msg;
    msgObject.chatid = data.chatid;
    return new Promise(function (resolve, reject) {
        msgObject.save(function (err, savedMsg) {
            if (err) return reject(err);
            return resolve("Chat message saved");
        })
    })
}

function getDBTags() {
    return new Promise(function (resolve, reject) {
        User.tagsSchema.find({}).sort('-date').limit(10).exec(function(err, data) { //sort('date', -1).limit(10);
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

function getUsers(next) {
    console.log("Got in db get users");
    User.UserSchema.find({}).exec(function (err, users) {
        if (err) {
            console.log("Users err" + err);
            return next();
        }
        return next(users);
    });
}

module.exports = {
    getUsers: getUsers,
    addTrend: addTrend,
    getDBTags: getDBTags,
    signup: signup,
    signin: signin,
    searchTag: searchTag,
    searchChat: searchChat,
    saveChatMsg: saveChatMsg,
    createChat: createChat
};