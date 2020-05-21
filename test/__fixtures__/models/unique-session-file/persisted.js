const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const sessions = [
    // 0: generate one sample session
    ...util.generateOneToMany('class', new Types.ObjectId(), [ models.generateFakeSession() ])
];

const sessionFiles = [
    // 0: generate one sample session file
    ...util.generateOneToMany('session', sessions[0]._id, [{ file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.session.modelName]: sessions,
    [db.names.sessionFile.modelName]: sessionFiles
};
