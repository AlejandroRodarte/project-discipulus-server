const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted.db[db.names.user.modelName];

const usersFiles = [

    // 0. associate file to unknown user
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ file: models.generateFakeFile() }]),

    // 1. associate file to user[0] (disabled)
    ...util.generateOneToMany('user', persistedUsers[0]._id, [{ file: models.generateFakeFile() }]),

    ...util.generateOneToMany('user', persistedUsers[1]._id, [

        // 2. associate user[1] the exact same pptx file it already has persisted
        { 
            file: {
                ...sampleFiles.presentationFile,
                _id: new Types.ObjectId()
            }
        },

        // 3. associate user[1] with a sample document file
        {
            file: sampleFiles.documentFile
        }

    ])

];

module.exports = {
    db: {
        [db.names.userFile.modelName]: usersFiles
    }
};
