const { shared } = require('../../schemas');
const { sharedFile } = require('../../names');
const getModel = require('../../get-model');

const SharedFile = getModel(sharedFile.modelName, shared.schemas.sharedFileSchema);

module.exports = SharedFile;
