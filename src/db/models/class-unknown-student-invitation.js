const db = require('..');
const { classUnknownStudentInvitationSchema } = require('../schemas/class-unknown-student-invitation');

const { classUnknownStudentInvitation } = require('../names');

const ClassUnknownStudentInvitation = db.getModel(classUnknownStudentInvitation.modelName, classUnknownStudentInvitationSchema);

module.exports = ClassUnknownStudentInvitation;