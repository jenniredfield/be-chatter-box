const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    active: Boolean,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;