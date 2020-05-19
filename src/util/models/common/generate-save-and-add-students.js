const { db } = require('../../../shared');
const { modelErrorMessages } = require('../../errors');

const generateSaveAndAddStudents = ({ studentModelName, foreignField }) => async function() {

    const doc = this;

    const Class = doc.model(db.names.class.modelName);
    const StudentModel = doc.model(studentModelName);

    const clazz = await Class.findOne({ _id: doc.class });

    if (!clazz) {
        throw new Error(modelErrorMessages.classNotFound);
    }

    try {
        await doc.save();
    } catch (e) {
        throw e;
    }

    try {

        const enabledStudentIds = await clazz.getEnabledStudentIds();

        const studentModelDocs = enabledStudentIds.map(classStudent => ({
            [foreignField]: doc._id,
            classStudent
        }));

        const studentDocs = await StudentModel.insertMany(studentModelDocs);

        return [doc, studentDocs];

    } catch (e) {
        return [doc, undefined];
    }

};

module.exports = generateSaveAndAddStudents;
