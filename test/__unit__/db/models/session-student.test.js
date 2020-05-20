const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [sessionStudentDoc] = fixtures.functions.util.generateOneToMany('classStudent', new Types.ObjectId(), [{ session: new Types.ObjectId() }]);
let sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

beforeEach(() => sessionStudent = fixtures.functions.models.getNewModelInstance(db.models.SessionStudent, sessionStudentDoc));

describe('[db/models/session-student] - Invalid classStudent _id', () => {

    it('Should not validate if classStudent _id is undefined', () => {
        sessionStudent.classStudent = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudent, db.schemas.definitions.sessionStudentDefinition.classStudent.required);
    });

});

describe('[db/models/session-student] - Invalid session', () => {

    it('Should not validate if session is undefined', () => {
        sessionStudent.session = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudent, db.schemas.definitions.sessionStudentDefinition.session.required);
    });

});

describe('[db/models/session-student] - Default write flag', () => {

    it('Should default write flag to false', () => {
        expect(sessionStudent.write).to.equal(false);
    });

});

describe('[db/models/session-student] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(sessionStudent);
    });

});

describe('[db/models/session-student] - methods.checkAndSave', () => {

    

});
