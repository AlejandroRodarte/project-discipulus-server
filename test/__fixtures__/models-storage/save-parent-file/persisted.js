const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, role, userRole, parentFile } = require('../../../../src/db/names');

const { roles, ids } = require('../../shared/roles');

const users = [

    // 0: disabled user
    ...generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
        noAvatar: true
    }),

    // 1-2: enabled users
    ...generateFakeUsers(2, {
        fakeToken: true,
        noAvatar: true
    }),

];

const userRoles = [

    // 0. user[0] (disabled) is a parent
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_PARENT }]),

    // 1. user[1] (enabled) is a student
    ...generateOneToMany('user', users[1]._id, [{ role: ids.ROLE_STUDENT }]),

    // 2. user[2] (enabled) is a parent
    ...generateOneToMany('user', users[2]._id, [{ role: ids.ROLE_PARENT }])

];

const parentFiles = [
    // 0. user[2] (enabled parent) will have associated a sample pptx parent file
    ...generateOneToMany('user', users[2]._id, [{ file: sampleFiles.documentFile }])
];

const storageParentFiles = attachKeynames([
    // 0. sample document file associated to user[2] (enabled parent)
    sampleFiles.documentFile
]);

module.exports = {

    db: {
        [user.modelName]: users,
        [role.modelName]: roles,
        [userRole.modelName]: userRoles,
        [parentFile.modelName]: parentFiles
    },

    storage: {
        [parentFile.modelName]: storageParentFiles
    }

};
