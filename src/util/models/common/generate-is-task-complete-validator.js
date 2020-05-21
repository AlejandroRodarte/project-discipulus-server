const { db } = require('../../../shared');
const { modelErrorMessages } = require('../../errors');

const generateIsTaskCompleteValidator = ({ modelName, ref, notFoundErrorMessage, alreadyCompleteErrorMessage }) => async (doc) => {

    const ParentModel = doc.model(modelName);
    const ClassStudent = doc.model(db.names.classStudent.modelName);
    
    const parentDoc = await ParentModel.findOne({
        _id: doc[ref]
    });

    if (!parentDoc) {
        throw new Error(notFoundErrorMessage);
    }

    if (parentDoc.completed) {
        throw new Error(alreadyCompleteErrorMessage);
    }

    const classStudent = await ClassStudent.findOne({
        _id: parentDoc.classStudent
    });

    if (!classStudent) {
        throw new Error(modelErrorMessages.classStudentNotFound);
    }

    // todo

};

module.exports = generateIsTaskCompleteValidator;
