const mongoose = require('mongoose');

const teardown = (modelNames) => async () => {

    for (const modelName of modelNames) {
        const Model = mongoose.model(modelName);
        await Model.deleteMany({});
    }

};

module.exports = teardown;
