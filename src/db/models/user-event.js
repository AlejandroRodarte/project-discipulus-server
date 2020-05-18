const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const UserEvent = getModel(db.names.userEvent.modelName, schemas.userEventSchema);

module.exports = UserEvent;
