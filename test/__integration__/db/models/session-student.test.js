const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session-student] - uniqueSessionStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionStudentContext.persisted));

    const unpersistedSessionStudents = fixtures.models.uniqueSessionStudentContext.unpersisted[shared.db.names.sessionStudent.modelName];

    describe('[db/models/session-student] - classStudent/session index', () => {

        it('Should fail on same classStudent/session _id combo', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[0];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);
            
            await expect(sessionStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same classStudent but different session', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[1];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

        it('Should persist on same session but different classStudent', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[2];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

        it('Should persist on different classStudent/session ids', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[3];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionStudentContext.persisted));

});