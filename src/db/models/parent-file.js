const db = require('../');
const { parentFileSchema } = require('../schemas/parent-file');

const { parentFile } = require('../names');

const ParentFile = db.getModel(parentFile.modelName, parentFileSchema);

module.exports = ParentFile;