const db = require('..');
const { userEventSchema } = require('../schemas/user-event');

const { userEvent } = require('../names');

const UserEvent = db.getModel(userEvent.modelName, userEventSchema);

module.exports = UserEvent;