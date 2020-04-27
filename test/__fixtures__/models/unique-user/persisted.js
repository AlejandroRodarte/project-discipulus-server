const { user } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const persisted = {
    // 0-0: generate one enabled fake user
    [user.modelName]: generateFakeUsers(1)
};

module.exports = persisted;