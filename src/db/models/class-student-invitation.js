const db = require('..');
const { classStudentInvitationSchema } = require('../schemas/class-student-invitation');

const { classStudentInvitation } = require('../names');

const ClassStudentInvitation = db.getModel(classStudentInvitation.modelName, classStudentInvitationSchema);

module.exports = ClassStudentInvitation;