const db = require('../../../db');
const { sharedFileSchema } = require('../../schemas/shared/file');

const { sharedFile } = require('../../names');

const SharedFile = db.getModel(sharedFile.modelName, sharedFileSchema);

module.exports = SharedFile;
