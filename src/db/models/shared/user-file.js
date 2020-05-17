const { shared } = require('../../schemas');
const { sharedUserFile } = require('../../names');
const getModel = require('../../get-model');

const SharedUserFile = getModel(sharedUserFile.modelName, shared.schemas.sharedUserFileSchema);

module.exports = SharedUserFile;