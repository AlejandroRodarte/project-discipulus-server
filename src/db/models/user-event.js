const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { userEvent } = require('../names');

const UserEvent = getModel(userEvent.modelName, schemas.userEventSchema);

module.exports = UserEvent;
