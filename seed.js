require('dotenv').config();
const mongoose = require("mongoose");
const faker = require("faker")
const DB = process.env.DB_URL;

const Message = require('./models/Message');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);
    console.log('connected to DB....');
    mongoose.connection.dropDatabase(() => {
        console.log('Database droped!');

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
                console.log(docs);
                mongoose.connection.close();
            });
    });
});