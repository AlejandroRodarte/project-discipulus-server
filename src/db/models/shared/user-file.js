const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedUserFile = getModel(db.names.sharedUserFile.modelName, shared.schemas.sharedUserFileSchema);

module.exports = SharedUserFile;