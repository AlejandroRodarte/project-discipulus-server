const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { parentFile } = require('../names');

const ParentFile = getModel(parentFile.modelName, schemas.parentFileSchema);

module.exports = ParentFile;
