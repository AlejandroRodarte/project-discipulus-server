const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedSessions = persisted[db.names.session.modelName];
const persistedSessionFiles = persisted[db.names.sessionFile.modelName];

const sessionFiles = [
    
    ...util.generateOneToMany('session', persistedSessions[0]._id, [

        // 0. session[0] with a second file with same originalname as sessionFile[0]
        {
            file: {
                ...models.generateFakeFile(),
                originalname: persistedSessionFiles[0].file.originalname
            }
        },

        // 1. session[0] with unique file
        { file: models.generateFakeFile() }
        
    ])

];

module.exports = {
    [db.names.sessionFile.modelName]: sessionFiles
};
