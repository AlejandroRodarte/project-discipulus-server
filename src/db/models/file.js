const { model } = require('mongoose');

const { fileSchema } = require('../schemas/file');

const File = model('File', fileSchema)

module.exports = File;
