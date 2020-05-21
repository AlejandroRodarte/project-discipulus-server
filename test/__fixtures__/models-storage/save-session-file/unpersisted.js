const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedSessions = persisted.db[db.names.session.modelName];

const sessionFiles = [
    
    // 0. unknown session with pdf file
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ file: sampleFiles.pdfFile }]),

    ...util.generateOneToMany('session', persistedSessions[0]._id, [

        // 1. session[0] with zip file (already persisted, non-unique)
        { file: sampleFiles.zipFile },

        // 2. session[0] with sheet file (unique)
        { file: sampleFiles.sheetFile }

    ])

];

module.exports = {
    db: {
        [db.names.sessionFile.modelName]: sessionFiles
    }
};