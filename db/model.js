'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
    username: { type: String, required: true},
    // salt: String,
    // saltedHash: String
    password: { type: String, required: true }
});

var tagsSchema = new Schema({
    tagname: { type: String, required: true},
    date: {
        type: Date,
        default: Date.now
    },
    long: String,
    lat: String,
    username: [String],
});

var chatSchema = new Schema({
    username: String,
    tags: [String],
    chatname: {
        type: String,
        required: true },
    long: String,
    lat: String,
    description: String
});

var imgChatJoinSchema = new Schema({
    username: String,
    tag: String,
    chatid: String,
    long: String,
    lat: String
});

var msgSchema = new Schema({
    username: { type: String, required: true},
    msg: String,
    chatid: String
});

var UserSchema = mongoose.model('UserSchema', UserSchema);
var tagsSchema = mongoose.model('tagsSchema', tagsSchema);
var msgSchema = mongoose.model('msgSchema', msgSchema);
var chatSchema = mongoose.model('chatSchema', chatSchema);
var imgChatJoinSchema = mongoose.model('imgChatJoinSchema', imgChatJoinSchema);

exports.UserSchema = UserSchema;
exports.tagsSchema = tagsSchema;
exports.msgSchema = msgSchema;
exports.chatSchema = chatSchema;
exports.imgChatJoinSchema = imgChatJoinSchema;

