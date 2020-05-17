const db = require('..');
const { sessionFileSchema } = require('../schemas/session-file');

const { sessionFile } = require('../names');

const SessionFile = db.getModel(sessionFile.modelName, sessionFileSchema);

module.exports = SessionFile;