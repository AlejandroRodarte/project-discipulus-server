const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ParentStudentInvitation = getModel(db.names.parentStudentInvitation.modelName, schemas.parentStudentInvitationSchema);

module.exports = ParentStudentInvitation;
