const { Types } = require('mongoose');
const expect = require('chai').expect;

const { ClassStudentInvitation } = require('../../../../src/db/models');
const { classStudentInvitationDefinition } = require('../../../../src/db/schemas/class-student-invitation');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classStudentInvitationDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

let classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

beforeEach(() => classStudentInvitation = modelFunctions.getNewModelInstance(ClassStudentInvitation, classStudentInvitationDoc));

describe('[db/models/class-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classStudentInvitation.class = undefined;
        modelFunctions.testForInvalidModel(classStudentInvitation, classStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-student-invitation] - Invalid user', () => {

    it('Should not validate if user _id is undefined', () => {
        classStudentInvitation.user = undefined;
        modelFunctions.testForInvalidModel(classStudentInvitation, classStudentInvitationDefinition.user.required);
    });

});

describe('[db/models/class-student-invitation] - Valid model', () => {

    it('Should validate correct class-student invitation model', () => {
        modelFunctions.testForValidModel(classStudentInvitation);
    })

});
