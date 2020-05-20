const { db } = require('../../../shared');
const { modelErrorMessages } = require('../../errors');

const generateClassStudentChildCheckAndSave = ({ foreignModel }) => async function() {

    const doc = this;

    const ClassStudent = doc.model(db.names.classStudent.modelName);
    const ForeignModel = doc.model(foreignModel.name);

    const foreignModelExists = await ForeignModel.exists({
        _id: doc[foreignModel.ref]
    });

    if (!foreignModelExists) {
        throw new Error(foreignModel.notFoundErrorMessage);
    }

    const classStudent = await ClassStudent.findOne({
        _id: doc.classStudent
    });

    if (!classStudent) {
        throw new Error(modelErrorMessages.classStudentNotFound);
    }

    const isStudentEnabled = await classStudent.isStudentEnabled();

    if (!isStudentEnabled) {
        throw new Error(modelErrorMessages.userDisabled);
    }

    try {
        await doc.save();
    } catch (e) {
        throw e;
    }

    return doc;

};

module.exports = generateClassStudentChildCheckAndSave;
