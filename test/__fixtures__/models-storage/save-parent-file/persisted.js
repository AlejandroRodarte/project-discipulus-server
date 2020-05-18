const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const { roles } = require('../../shared');

const users = [

    // 0: disabled user
    ...models.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
        noAvatar: true
    }),

    // 1-2: enabled users
    ...models.generateFakeUsers(2, {
        fakeToken: true,
        noAvatar: true
    }),

];

const userRoles = [

    // 0. user[0] (disabled) is a parent
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 1. user[1] (enabled) is a student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] (enabled) is a parent
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_PARENT }])

];

const parentFiles = [
    // 0. user[2] (enabled parent) will have associated a sample pptx parent file
    ...util.generateOneToMany('user', users[2]._id, [{ file: sampleFiles.documentFile }])
];

const storageParentFiles = util.attachKeynames([
    // 0. sample document file associated to user[2] (enabled parent)
    sampleFiles.documentFile
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users,
        [db.names.role.modelName]: roles.roles,
        [db.names.userRole.modelName]: userRoles,
        [db.names.parentFile.modelName]: parentFiles
    },

    storage: {
        [db.names.parentFile.modelName]: storageParentFiles
    }

};
