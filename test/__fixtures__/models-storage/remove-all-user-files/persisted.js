const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const { sampleFiles } = require('../../shared');

const { roles } = require('../../shared');

// 0: generate one sample user
const users = models.generateFakeUsers(1, { fakeToken: 1, noAvatar: true });

// associate user[0] with a sample jpg avatar
users[0].avatar = sampleFiles.jpgImage;

const userRoles = [
    // 0-3: associate user[0] with all roles
    ...util.generateOneToMany('user', users[0]._id, [
        { role: roles.ids.ROLE_ADMIN },
        { role: roles.ids.ROLE_PARENT },
        { role: roles.ids.ROLE_STUDENT },
        { role: roles.ids.ROLE_TEACHER }
    ])
];

const userFiles = [
    // 0: associate user[0] with a sample document file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.documentFile }])
];

const parentFiles = [
    // 1: associate user[0] as a parent with a pdf file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.pdfFile }])
];

const studentFiles = [
    // 2: associate user[0] as a student with a sheet file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.sheetFile }])
];

const teacherFiles = [
    // 3. associate user[0] as a teacher with a pptx file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.presentationFile }])
];

const userAvatars = util.attachKeynames([
    // jpg image associated to the user[0] avatar
    sampleFiles.jpgImage
]);

const storageUserFiles = util.attachKeynames([
    // document file associated to user[0]
    sampleFiles.documentFile
]);

const storageParentFiles = util.attachKeynames([
    // pdf file associated to user[0] as parent
    sampleFiles.pdfFile
]);

const storageStudentFiles = util.attachKeynames([
    // sheet file associated to user[0] as a student
    sampleFiles.sheetFile
]);

const storageTeacherFiles = util.attachKeynames([
    // pptx file associated to user[0] as a teacher
    sampleFiles.presentationFile
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users,
        [db.names.role.modelName]: roles.roles,
        [db.names.userRole.modelName]: userRoles,
        [db.names.userFile.modelName]: userFiles,
        [db.names.parentFile.modelName]: parentFiles,
        [db.names.studentFile.modelName]: studentFiles,
        [db.names.teacherFile.modelName]: teacherFiles
    },

    storage: {
        [db.names.user.modelName]: userAvatars,
        [db.names.userFile.modelName]: storageUserFiles,
        [db.names.parentFile.modelName]: storageParentFiles,
        [db.names.studentFile.modelName]: storageStudentFiles,
        [db.names.teacherFile.modelName]: storageTeacherFiles
    }

};
