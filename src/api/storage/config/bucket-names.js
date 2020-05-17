const { names } = require('../../../db');

module.exports = {
    test: `${process.env.BUCKET_PREFIX_NAME}-test`,
    [names.user.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-avatars`,
    [names.userFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-files`,
    [names.teacherFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-teacher-files`,
    [names.studentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-student-files`,
    [names.parentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-parent-files`,
    [names.class.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-avatars`,
    [names.classFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-files`,
    [names.classStudentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-student-files`,
    [names.sessionFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-session-files`,
    [names.sessionStudentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-session-student-files`
};
