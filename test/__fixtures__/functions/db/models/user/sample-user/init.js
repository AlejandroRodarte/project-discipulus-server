const User = require('../../../../../../../src/db/models/user');
const sampleUser = require('../../../../../models/user/persisted/sample-user');

const init = async () => {
    await new User(sampleUser).save();
};

module.exports = init;