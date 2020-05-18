const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassStudentInvitation = getModel(db.names.classStudentInvitation.modelName, schemas.classStudentInvitationSchema);

module.exports = ClassStudentInvitation;
