const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const sessions = [
    // 0. sample session
    ...util.generateOneToMany('class', new Types.ObjectId(), [ models.generateFakeSession() ])
];

const sessionFiles = [
    // 0. session[0] has sample zip file
    ...util.generateOneToMany('session', sessions[0]._id, [{ file: sampleFiles.zipFile }])
];

const storageSessionFiles = util.attachKeynames([
    // 0. zip file associated to sessionFile[0]
    sampleFiles.zipFile
]);

module.exports = {

    db: {
        [db.names.session.modelName]: sessions,
        [db.names.sessionFile.modelName]: sessionFiles
    },

    storage: {
        [db.names.sessionFile.modelName]: storageSessionFiles
    }

};
