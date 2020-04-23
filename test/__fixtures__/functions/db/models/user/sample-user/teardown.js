const User = require('../../../../../../../src/db/models/user');

const teardown = async () => {
    await User.deleteMany({});
};

module.exports = teardown;