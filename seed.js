require('dotenv').config();
const mongoose = require("mongoose");
const faker = require("faker")
const DB = process.env.DB_URL;

const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);
    console.log('connected to DB....');
    mongoose.connection.dropDatabase(() => {
        console.log('Database dropped!');

        const promises = [];

        for(let i = 0; i < 10; i++) {
            promises.push(Message.create({
                message: faker.lorem.paragraph(),
                user: faker.name.firstName(),
                dateStamp: Date.now()
            }));
        }

        Promise.all(promises)
            .then((docs) => {
                console.log('Documents saved!');

                ChatRoom.create({
                    name: "StarWars",
                    messages: docs
                })
                .then((doc) => {
                    console.log(doc)
                    mongoose.connection.close();
                });
            });
    });
});