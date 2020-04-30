const names = require('../../../db/names');

module.exports = {
    [names.user.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-avatars`,
    [names.userFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-user-files`,
    [names.teacherFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-teacher-files`,
    [names.studentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-student-files`,
    [names.parentFile.modelName]: `${process.env.BUCKET_PREFIX_NAME}-parent-files`
};