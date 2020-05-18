const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedFile = getModel(db.names.sharedFile.modelName, shared.schemas.sharedFileSchema);

module.exports = SharedFile;
