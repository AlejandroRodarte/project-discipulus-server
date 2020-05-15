const mongoose = require('./mongoose');
const getModel = require('./get-model');
const applyDeletionRules = require('./apply-deletion-rules');

module.exports = {
    mongoose,
    getModel,
    applyDeletionRules
};
