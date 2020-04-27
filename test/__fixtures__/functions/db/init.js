const mongoose = require('mongoose');

const init = (persistedContext) => async () => {

    for (const modelName in persistedContext) {

        const Model = mongoose.model(modelName);

        for (const doc of persistedContext[modelName]) {
            await new Model(doc).save();
        }

    }

};

module.exports = init;
