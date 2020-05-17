const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { parentStudentInvitation } = require('../names');

const ParentStudentInvitation = getModel(parentStudentInvitation.modelName, schemas.parentStudentInvitationSchema);

module.exports = ParentStudentInvitation;
