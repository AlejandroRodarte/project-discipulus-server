const { model, models } = require('mongoose');

const getModel = (modelName, modelSchema) => models[modelName] ? model(modelName) : model(modelName, modelSchema);

module.exports = getModel;
