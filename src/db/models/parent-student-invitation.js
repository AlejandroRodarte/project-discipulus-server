const db = require('../');
const { parentStudentInvitationSchema } = require('../schemas/parent-student-invitation');

const { parentStudentInvitation } = require('../names');

const ParentStudent = db.getModel(parentStudentInvitation.modelName, parentStudentInvitationSchema);

module.exports = ParentStudent;