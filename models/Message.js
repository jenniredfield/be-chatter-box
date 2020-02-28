const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: String,
    user: String,
    dateStamp: Date
});

module.exports = mongoose.model('Message', MessageSchema);