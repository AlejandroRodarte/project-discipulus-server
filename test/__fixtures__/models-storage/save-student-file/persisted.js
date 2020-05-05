const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, role, userRole, studentFile } = require('../../../../src/db/names');

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

    // 0. user[0] (disabled) is a student
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_STUDENT }]),

    // 1. user[1] (enabled) is a teacher
    ...generateOneToMany('user', users[1]._id, [{ role: ids.ROLE_TEACHER }]),

    // 2. user[2] (enabled) is a student
    ...generateOneToMany('user', users[2]._id, [{ role: ids.ROLE_STUDENT }])

];

const studentFiles = [
    // 0. user[2] (enabled student) will have associated a sample pptx student file
    ...generateOneToMany('user', users[2]._id, [{ file: sampleFiles.sheetFile }])
];

const storageStudentFiles = attachKeynames([
    // 0. sample document file associated to user[2] (enabled student)
    sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [user.modelName]: users,
        [role.modelName]: roles,
        [userRole.modelName]: userRoles,
        [studentFile.modelName]: studentFiles
    },

    storage: {
        [studentFile.modelName]: storageStudentFiles
    }

};
