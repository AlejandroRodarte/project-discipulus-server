const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { userFile } = require('../names');

const UserFile = getModel(userFile.modelName, schemas.userFileSchema);

module.exports = UserFile;
