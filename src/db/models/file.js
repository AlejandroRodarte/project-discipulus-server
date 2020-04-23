const db = require('../');
const { fileSchema } = require('../schemas/file');

const File = db.getModel('File', fileSchema);

module.exports = File;
