require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const PORT = 3000;
const DB = process.env.DB_URL;
const bodyParser = require('body-parser');
const cors = require('cors');

const Channel = require('./models/Channel');
const Message = require('./models/Message');
const User = require('./models/User');

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log('database connected!');
  }
);

app.use(bodyParser.json());
app.use(cors());

app.get('/channel/*', (req, res) => {
  const channelId = req.path.split('/')[2];

  Channel.find({ _id: channelId }).then((channel) => {
    res.send(channel);
  });
});

app.get('/allChannels', (req, res) => {
  try {
    Channel.find().then((channels) => {
      const newChannels = channels.map((c) => {
        return {
          channelName: c.channelName,
          channelId: c._id,
        };
      });
      res.send(newChannels);
    });
  } catch (err) {
    console.log('err', err);
  }
});

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    // save this to DB
    if(message.channelId) {
      Channel.findOne({ _id: message.channelId }).then((channel) => {
        channel.messages.push(
          new Message({
            message: message.message,
            user: message.user,
            dateStamp: message.dateStamp,
            channelId: message.channelId,
          })
        );
        channel.save().then((channel) => {
          console.log('message saved');
          console.log(channel);
          io.emit('messages', message);
        });
      });
    }
  });
});

app.post('/createChannel', (req, res) => {
  const body = req.body;
  const name = body.name;

  Channel.create({
    channelName: name,
    messages: [],
    users: [],
  }).then((channel) => {
    channel.save().then(() => {
      res.send('Channel created!');
    });
  });
});

app.post('/setUser', (req, res) => {
  const { username, channelId } = req.body;

  try {
    Channel.findOne({ _id: channelId }).then((channel) => {
      channel.users.push(
        new User({
          username,
          active: true,
        })
      );
      channel.save().then((channel) => {
        console.log('saved user to channel');
        res.send('Saved');
      });
    });
  } catch (err) {
    console.log('err', err);
  }
});

http.listen(PORT, () => {
  console.log('listening on *:3000');
});
