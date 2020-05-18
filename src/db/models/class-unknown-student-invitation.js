const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassUnknownStudentInvitation = getModel(db.names.classUnknownStudentInvitation.modelName, schemas.classUnknownStudentInvitationSchema);

module.exports = ClassUnknownStudentInvitation;
