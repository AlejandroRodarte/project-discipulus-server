const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const Session = getModel(db.names.session.modelName, schemas.sessionSchema);

module.exports = Session;
