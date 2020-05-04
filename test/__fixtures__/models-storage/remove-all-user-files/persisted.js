const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, userFile, parentFile, studentFile, teacherFile, userRole, role } = require('../../../../src/db/names');

const sharedRoles = require('../../shared/roles');

// 0: generate one sample user
const users = generateFakeUsers(1, { fakeToken: 1, noAvatar: true });

// associate user[0] with a sample jpg avatar
users[0].avatar = sampleFiles.jpgImage;

const userRoles = [
    // 0-3: associate user[0] with all roles
    ...generateOneToMany('user', users[0]._id, [
        { role: sharedRoles.ids.ROLE_ADMIN },
        { role: sharedRoles.ids.ROLE_PARENT },
        { role: sharedRoles.ids.ROLE_STUDENT },
        { role: sharedRoles.ids.ROLE_TEACHER }
    ])
];

const userFiles = [
    // 0: associate user[0] with a sample document file
    ...generateOneToMany('user', users[0]._id, [{ file: sampleFiles.documentFile }])
];

const parentFiles = [
    // 1: associate user[0] as a parent with a pdf file
    ...generateOneToMany('user', users[0]._id, [{ file: sampleFiles.pdfFile }])
];

const studentFiles = [
    // 2: associate user[0] as a student with a sheet file
    ...generateOneToMany('user', users[0]._id, [{ file: sampleFiles.sheetFile }])
];

const teacherFiles = [
    // 3. associate user[0] as a teacher with a pptx file
    ...generateOneToMany('user', users[0]._id, [{ file: sampleFiles.presentationFile }])
];

const userAvatars = attachKeynames([
    // jpg image associated to the user[0] avatar
    sampleFiles.jpgImage
]);

const storageUserFiles = attachKeynames([
    // document file associated to user[0]
    sampleFiles.documentFile
]);

const storageParentFiles = attachKeynames([
    // pdf file associated to user[0] as parent
    sampleFiles.pdfFile
]);

const storageStudentFiles = attachKeynames([
    // sheet file associated to user[0] as a student
    sampleFiles.sheetFile
]);

const storageTeacherFiles = attachKeynames([
    // pptx file associated to user[0] as a teacher
    sampleFiles.presentationFile
]);

module.exports = {

    db: {
        [user.modelName]: users,
        [role.modelName]: sharedRoles.roles,
        [userRole.modelName]: userRoles,
        [userFile.modelName]: userFiles,
        [parentFile.modelName]: parentFiles,
        [studentFile.modelName]: studentFiles,
        [teacherFile.modelName]: teacherFiles
    },

    storage: {
        [user.modelName]: userAvatars,
        [userFile.modelName]: storageUserFiles,
        [parentFile.modelName]: storageParentFiles,
        [studentFile.modelName]: storageStudentFiles,
        [teacherFile.modelName]: storageTeacherFiles
    }

};
