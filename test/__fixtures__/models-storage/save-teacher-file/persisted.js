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

    // 0. user[0] (disabled) is a teacher
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_TEACHER }]),

    // 1. user[1] (enabled) is a parent
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 2. user[2] (enabled) is a teacher
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_TEACHER }])

];

const teacherFiles = [
    // 0. user[2] (enabled teacher) will have associated a sample pptx teacher file
    ...util.generateOneToMany('user', users[2]._id, [{ file: sampleFiles.zipFile }])
];

const storageTeacherFiles = util.attachKeynames([
    // 0. sample document file associated to user[2] (enabled teacher)
    sampleFiles.zipFile
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users,
        [db.names.role.modelName]: roles.roles,
        [db.names.userRole.modelName]: userRoles,
        [db.names.teacherFile.modelName]: teacherFiles
    },

    storage: {
        [db.names.teacherFile.modelName]: storageTeacherFiles
    }

};
