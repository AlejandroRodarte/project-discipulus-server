const db = require('../');
const { fileSchema } = require('../schemas/file');

const { file } = require('../names');

const File = db.getModel(file.modelName, fileSchema);

module.exports = File;
