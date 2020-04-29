const db = require('../../../db');
const { sharedUserFileSchema } = require('../../schemas/shared/user-file');

const { sharedUserFile } = require('../../names');

const SharedUserFile = db.getModel(sharedUserFile.modelName, sharedUserFileSchema);

module.exports = SharedUserFile;