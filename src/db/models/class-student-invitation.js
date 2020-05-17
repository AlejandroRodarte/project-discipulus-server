const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classStudentInvitation } = require('../names');

const ClassStudentInvitation = getModel(classStudentInvitation.modelName, schemas.classStudentInvitationSchema);

module.exports = ClassStudentInvitation;
