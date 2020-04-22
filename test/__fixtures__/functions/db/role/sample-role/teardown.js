const Role = require('../../../../../../src/db/models/role');

const teardown = async () => {
    await Role.deleteMany({});
};

module.exports = teardown;
