const db = require('..');
const { sessionSchema } = require('../schemas/session');

const { session } = require('../names');

const Session = db.getModel(session.modelName, sessionSchema);

module.exports = Session;