const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const UserFile = getModel(db.names.userFile.modelName, schemas.userFileSchema);

module.exports = UserFile;
