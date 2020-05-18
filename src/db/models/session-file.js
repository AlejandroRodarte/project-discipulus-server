const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const SessionFile = getModel(db.names.sessionFile.modelName, schemas.sessionFileSchema);

module.exports = SessionFile;
