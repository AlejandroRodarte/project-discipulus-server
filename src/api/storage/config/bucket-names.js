const { db } = require('../../../shared');

module.exports = {
    test: `${process.env.BUCKET_PREFIX_NAME}-test`,
    [db.names.user.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-avatars`,
    [db.names.userFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-files`,
    [db.names.teacherFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-teacher-files`,
    [db.names.studentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-student-files`,
    [db.names.parentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-parent-files`,
    [db.names.class.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-avatars`,
    [db.names.classFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-files`,
    [db.names.classStudentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-class-student-files`,
    [db.names.sessionFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-session-files`,
    [db.names.sessionStudentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-session-student-files`
};
