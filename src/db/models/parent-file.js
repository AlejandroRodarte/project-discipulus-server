const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ParentFile = getModel(db.names.parentFile.modelName, schemas.parentFileSchema);

module.exports = ParentFile;
