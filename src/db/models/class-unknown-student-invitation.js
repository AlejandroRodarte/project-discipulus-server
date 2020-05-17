const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classUnknownStudentInvitation } = require('../names');

const ClassUnknownStudentInvitation = getModel(classUnknownStudentInvitation.modelName, schemas.classUnknownStudentInvitationSchema);

module.exports = ClassUnknownStudentInvitation;
