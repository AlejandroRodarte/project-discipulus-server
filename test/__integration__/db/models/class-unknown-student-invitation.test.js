const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassUnknownStudentInvitation } = require('../../../../src/db/models');

const { uniqueClassUnknownStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-unknown-student-invitation] - uniqueClassUnknownStudentInvitationContext', () => {

    beforeEach(db.init(uniqueClassUnknownStudentInvitationContext.persisted));

    const unpersistedClassUnknownStudentInvitations = uniqueClassUnknownStudentInvitationContext.unpersisted[names.classUnknownStudentInvitation.modelName];

    describe('[db/models/class-unknown-student-invitation] - class/email index', () => {

        it('Should fail on same class/email combo', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[0];
            const classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
            
            await expect(classUnknownStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different email', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[1];
            const classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

        it('Should persist on same email but different class', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[2];
            const classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

        it('Should persist on different class/email combo', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[3];
            const classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

    });

    afterEach(db.teardown(uniqueClassUnknownStudentInvitationContext.persisted));

});