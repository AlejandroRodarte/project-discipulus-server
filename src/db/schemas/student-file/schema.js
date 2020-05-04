const { Schema } = require('mongoose');

const studentFileDefinition = require('./definition');
const { studentFile } = require('../../names');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: studentFile.collectionName
};

const studentFileSchema = new Schema(studentFileDefinition, schemaOpts);

studentFileSchema.index({ user: 1, 'file.originalname': 1 }, { unique: true });

studentFileSchema.pre('remove', async function(next) {

    const studentFileDoc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[studentFile.modelName], [studentFileDoc.file.keyname]);
        next();
    } catch (e) {
        next(new Error('File could not be deleted'));
    }

});

studentFileSchema.methods.saveFileAndDoc = async function(buffer) {

    const studentFileDoc = this;
    const User = studentFileDoc.model(user.modelName);

    const { user: userId } = studentFileDoc;

    const studentDoc = await User.findOne({ 
        _id: userId,
        enabled: true
    });

    if (!studentDoc) {
        throw new Error('Your account is currently disabled or has been deleted');
    }

    const isStudent = await studentDoc.hasRole(roleTypes.ROLE_STUDENT);

    if (!isStudent) {
        throw new Error('You must be a student in order to save a file here');
    }

    try {
        await studentFileDoc.save();
    } catch (e) {
        throw e;
    }

    try {
        await storageApi.createMultipartObject(bucketNames[studentFile.modelName], {
            keyname: studentFileDoc.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: studentFileDoc.file.mimetype
        });
    } catch (e) {
        await studentFileDoc.remove();
        throw e;
    }

    return studentFileDoc;

};

module.exports = studentFileSchema;
