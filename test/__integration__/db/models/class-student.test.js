const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudent } = require('../../../../src/db/models');

const { uniqueClassStudentContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student] - uniqueClassStudentContext', () => {

    beforeEach(db.init(uniqueClassStudentContext.persisted));

    const unpersistedClassStudents = uniqueClassStudentContext.unpersisted[names.classStudent.modelName];

    describe('[db/models/class-student] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new ClassStudent(classStudentDoc);
            
            await expect(classStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentDoc = unpersistedClassStudents[1];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentDoc = unpersistedClassStudents[2];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentDoc = unpersistedClassStudents[3];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

    });

    afterEach(db.teardown(uniqueClassStudentContext.persisted));

});
