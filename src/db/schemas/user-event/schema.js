const { Schema } = require('mongoose');

const userEventDefinition = require('./definition');
const { userEvent } = require('../../names');

const schemaOpts = {
    collection: userEvent.collectionName
};

const userEventSchema = new Schema(userEventDefinition, schemaOpts);

module.exports = userEventSchema;
