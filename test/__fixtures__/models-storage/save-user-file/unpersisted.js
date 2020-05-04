const { Types } = require('mongoose');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, userFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted.db[user.modelName];

const usersFiles = [
    ...generateOneToMany('user', persistedUsers[1]._id, [

        // 0. associate user[1] the exact same pptx file it already has persisted
        { 
            file: {
                ...sampleFiles.presentationFile,
                _id: new Types.ObjectId()
            }
        },

        // 1. associate user[1] with a sample document file
        {
            file: sampleFiles.documentFile
        }

    ])
];

module.exports = {
    db: {
        [user.modelName]: users,
        [userFile.modelName]: usersFiles
    }
};
