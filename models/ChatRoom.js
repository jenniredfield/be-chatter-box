const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoom = new Schema({
    name: String,
    messages: Array
});

module.exports = mongoose.model('ChatRoom', ChatRoom);