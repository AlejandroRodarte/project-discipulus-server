const mongoose = require('./mongoose');
const getModel = require('./get-model');
const applyDeletionRules = require('./apply-deletion-rules');
const schemas = require('./schemas');
const models = require('./models');
const aggregation = require('./aggregation');
const names = require('./names');

module.exports = {
    mongoose,
    getModel,
    applyDeletionRules,
    schemas,
    models,
    aggregation,
    names
};
