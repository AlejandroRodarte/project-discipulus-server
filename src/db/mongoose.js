const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/discipulus-api-test';

const connect = async () => {

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    if (process.env.NODE_ENV === 'development') {
        console.log(`Connected to MongoDB database at ${uri}`);
    }

};

const disconnect = async () => {

    await mongoose.disconnect();

    if (process.env.NODE_ENV === 'development') {
        console.log('Disconnected from database');
    }

};

module.exports = {
    connect,
    disconnect
};
