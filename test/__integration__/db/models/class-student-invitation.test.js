const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudentInvitation } = require('../../../../src/db/models');

const { uniqueClassStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-invitation] - uniqueClassStudentInvitationContext', () => {

    beforeEach(db.init(uniqueClassStudentInvitationContext.persisted));

    const unpersistedClassStudentInvitations = uniqueClassStudentInvitationContext.unpersisted[names.classStudentInvitation.modelName];

    describe('[db/models/class-student-invitation] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[0];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);
            
            await expect(classStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[1];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[2];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[3];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

    });

    afterEach(db.teardown(uniqueClassStudentInvitationContext.persisted));

});