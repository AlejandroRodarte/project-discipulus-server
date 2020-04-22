const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connect = async () => {

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    if (process.env.NODE_ENV !== 'test') {
        console.log(`Connected to MongoDB database at ${uri}`);
    }

};

const disconnect = async () => {

    await mongoose.disconnect();

    if (process.env.NODE_ENV !== 'test') {
        console.log('Disconnected from database');
    }

};

module.exports = {
    connect,
    disconnect
};
