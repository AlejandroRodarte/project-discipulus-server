const { model, models } = require('mongoose');

const getModel = (modelName, modelSchema) => {

    if (process.env.NODE_ENV === 'test' && models[modelName]) {
        delete models[modelName];
    }

    return model(modelName, modelSchema);

};

module.exports = getModel;
