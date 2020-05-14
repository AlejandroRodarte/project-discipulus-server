const { Types } = require('mongoose');
const faker = require('faker');

const expect = require('chai').expect;

const { ClassUnknownStudentInvitation } = require('../../../../src/db/models');
const { classUnknownStudentInvitationDefinition } = require('../../../../src/db/schemas/class-unknown-student-invitation');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classUnknownStudentInvitationDoc = {
    class: new Types.ObjectId(),
    email: faker.internet.email()
};

let classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

beforeEach(() => classUnknownStudentInvitation = modelFunctions.getNewModelInstance(ClassUnknownStudentInvitation, classUnknownStudentInvitationDoc));

describe('[db/models/class-unknown-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classUnknownStudentInvitation.class = undefined;
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-unknown-student-invitation] - Invalid email', () => {

    it('Should not validate if email is undefined', () => {
        classUnknownStudentInvitation.email = undefined;
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.email.required);
    });

    it('Should not validate if email is not formatted properly', () => {
        classUnknownStudentInvitation.email = 'not-an@@-email.com.mx';
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.email.validate);
    });

});

describe('[db/models/class-unknown-student-invitation] - Valid email', () => {

    it('Should trim valid email', () => {
        
        classUnknownStudentInvitation.email = '   super-email@somewhere.gov  ';
        modelFunctions.testForValidModel(classUnknownStudentInvitation);
    
        expect(classUnknownStudentInvitation.email).to.equal('super-email@somewhere.gov');
    
    });

});


describe('[db/models/class-unknown-student-invitation] - Valid model', () => {

    it('Should validate correct class-unknown-student invitation model', () => {
        modelFunctions.testForValidModel(classUnknownStudentInvitation);
    })

});
