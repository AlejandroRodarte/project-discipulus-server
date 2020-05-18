const { db } = require('../../../../src/shared');

const { models } = require('../../functions');

const persisted = {
    // 0-0: generate one enabled fake user
    [db.names.user.modelName]: models.generateFakeUsers(1)
};

module.exports = persisted;