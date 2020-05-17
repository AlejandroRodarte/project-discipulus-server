const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { session } = require('../names');

const Session = getModel(session.modelName, schemas.sessionSchema);

module.exports = Session;
