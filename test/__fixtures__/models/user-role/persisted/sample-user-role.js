const { Types } = require('mongoose');

const sampleUserRole = {
    user: new Types.ObjectId(),
    role: new Types.ObjectId()
};

module.exports = sampleUserRole;
