require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors')
const mongoose = require('mongoose');
const PORT = 3000;
const DB = process.env.DB_URL;
const bodyParser = require('body-parser');

app.options('*', cors())

var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
});

const Channel = require('./models/Channel');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);
    console.log('database connected!')
})


app.use(bodyParser.json());

app.get('/', () => {
    res.send('connection alive')
})

app.get('/channel/*', (req, res) => {
    const channelId = req.path.split('/')[2];

    Channel.find({_id: channelId})
        .then(channel => {
            res.send(channel);
        });
})

app.get('/messages/*', (req, res) => {
    const channelId = req.path.split('/')[2];

    Channel.find({_id: channelId})
    .then(channel =>{
    console.log("channel", channel)
        res.send({messages: channel[0].messages});
    })
})

app.post('/createChannel', (req, res) =>{
    const body = req.body;
    const name = body.name;

    Channel.create({
        channelName: name,
        messages: [],
        users: []
    }).then(channel => {
        channel.save()
        .then(() =>{
            res.send('Channel created!')
        })
    });

});

app.post('/message/*', (req, res) =>{
    const channelId = req.path.split('/')[2];
    console.log("channelId", channelId)
    const messageBody = req.body;

    Channel.findOne({_id: channelId})
    .then((channel) => {
        //TODO: Use messages model
        channel.messages.push(messageBody);

        channel.save()
        .then(savedChannel => {
            console.log('message saved!');
            res.send(savedChannel);
        });
    })
});

app.get('*', (req, res) => {
    res.send('<div>Handler</div>');
})

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});