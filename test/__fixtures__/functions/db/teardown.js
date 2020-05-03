const mongoose = require('mongoose');

const teardown = (persistedContext) => async () => {

    const modelNames = Object.keys(persistedContext);

    for (const modelName of modelNames) {
        const Model = mongoose.model(modelName);
        await Model.deleteMany({});
    }

};

module.exports = teardown;
