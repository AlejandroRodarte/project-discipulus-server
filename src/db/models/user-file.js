const db = require('..');
const { userFileSchema } = require('../schemas/user-file');

const { userFile } = require('../names');

const UserFile = db.getModel(userFile.modelName, userFileSchema);

module.exports = UserFile;