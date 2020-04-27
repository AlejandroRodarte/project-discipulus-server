const { user } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const persisted = {
    [user.modelName]: generateFakeUsers(1)
};

module.exports = persisted;