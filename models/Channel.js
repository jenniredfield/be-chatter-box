const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
    channelName: String,
    messages: Array,
    users: Array,
    id: String
});

const ChannelModel = mongoose.model('Channel', ChannelSchema);

module.exports = ChannelModel;