require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const DB = process.env.DB_URL;

const ChatRoom = require('./models/ChatRoom');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);
    console.log('database connected!')
})


app.get('/general', (req, res) => {
    console.log('get')
    ChatRoom.findOne({name: 'General'})
        .then((docs) => {
            res.send(docs)
        }).catch(() => {
            res.send(400);
        })
});

app.get('/starwars', (req, res) => {
    console.log('get')
    ChatRoom.findOne({name: 'StarWars'})
        .then((docs) => {
            res.send(docs)
        }).catch(() => {
            res.send(400);
        })
});

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});