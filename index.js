require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const PORT = 3000;
const DB = process.env.DB_URL;
const bodyParser = require('body-parser');

const Channel = require('./models/Channel');
const Message = require('./models/Message');

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if(err) console.log(err);
  console.log('database connected!')
});

app.use(bodyParser.json());

app.get('/channel/*', (req, res) => {
  const channelId = req.path.split('/')[1];

  Channel.find({_id: channelId})
    .then((channel) => {
      res.send(channel)
    });
});

app.get('/allChannels', (req, res) => {
  Channel.find()
  .then(channels => {
    res.send(channels);
  })
})

io.on('connection', (socket) => {
  socket.on('message', (message) => {
      // save this to DB
      Channel.findOne({_id: message.channelId})
      .then(channel => {
        channel.messages.push(new Message({
          message: message.message,
          user: message.user,
          dateStamp: message.dateStamp,
          channelId: message.channelId
        }));
        channel.save()
        .then((channel) => {
          console.log('message saved');
          console.log(channel)
          io.emit('messages', message);
        });
      });
  });
});


http.listen(PORT, () => {
  console.log('listening on *:3000');
});












// app.get('/channel/*', (req, res) => {
//     const channelId = req.path.split('/')[2];

//     Channel.find({_id: channelId})
//         .then(channel => {
//             res.send(channel);
//         });
// })

// app.get('/messages/*', (req, res) => {
//     const channelId = req.path.split('/')[2];

//     Channel.find({_id: channelId})
//     .then(channel =>{
//     console.log("channel", channel)
//         res.send({messages: channel[0].messages});
//     })
// })

// app.post('/createChannel', (req, res) =>{
//     const body = req.body;
//     const name = body.name;

//     Channel.create({
//         channelName: name,
//         messages: [],
//         users: []
//     }).then(channel => {
//         channel.save()
//         .then(() =>{
//             res.send('Channel created!')
//         })
//     });

// });

// app.post('/message/*', (req, res) =>{
//     const channelId = req.path.split('/')[2];
//     console.log("channelId", channelId)
//     const messageBody = req.body;

//     Channel.findOne({_id: channelId})
//     .then((channel) => {
//         //TODO: Use messages model
//         channel.messages.push(messageBody);

//         channel.save()
//         .then(savedChannel => {
//             console.log('message saved!');
//             res.send(savedChannel);
//         });
//     })
// });

// app.get('*', (req, res) => {
//     res.send('<div>Handler</div>');
// })

// app.listen(PORT, () => {
//     console.log(`Server listening on Port ${PORT}`);
// });