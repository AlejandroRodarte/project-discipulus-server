const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { sessionFile } = require('../names');

const SessionFile = getModel(sessionFile.modelName, schemas.sessionFileSchema);

module.exports = SessionFile;
