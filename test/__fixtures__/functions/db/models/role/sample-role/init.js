const sampleRole = require('../../../../../models/role/persisted/sample-role');

const init = async () => {
    await sampleRole.save();
};

module.exports = init;
