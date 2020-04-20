const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connect = () => mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    () => console.log(`Connected to MongoDB database at ${uri}`)
);

module.exports = connect;
