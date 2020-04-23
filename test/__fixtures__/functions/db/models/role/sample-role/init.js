const Role = require('../../../../../../../src/db/models/role');
const sampleRole = require('../../../../../models/role/persisted/sample-role');

const init = async () => {
    await new Role(sampleRole).save();
};

module.exports = init;
