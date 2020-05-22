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

const [userDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const classDoc = {
    user: userDoc._id,
    ...fixtures.functions.models.generateFakeClass({
        titleWords: 5,
        descriptionWords: 20,
        timeRanges: [[0, 20], [30, 40], [70, 90]]
    })
};

let clazz = new db.models.Class(classDoc);
let user = new db.models.User(userDoc);

beforeEach(() => {
    clazz = fixtures.functions.models.getNewModelInstance(db.models.Class, classDoc);
    user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc);
});

describe('[db/models/class] - Invalid user', () => {

    it('Should not validate if user _id is not defined', () => {
        clazz.user = undefined;
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.user.required);
    });

});

describe('[db/models/class] - Invalid title', () => {

    const [titleMinLength] = db.schemas.definitions.classDefinition.title.minlength;
    const [titleMaxLength] = db.schemas.definitions.classDefinition.title.maxlength;

    it('Should not validate if title is undefined', () => {
        clazz.title = undefined;
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.title.required);
    });

    it('Should not validate if title has a profane word', () => {
        clazz.title = 'Some good thermodynamic shit';
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.title.validate);
    });

    it(`Should not validate if title is shorter than ${ titleMinLength } characters`, () => {
        clazz.title = 'bo';
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.title.minlength);
    });

    it(`Should not validate if title is longer than ${ titleMaxLength } characters`, () => {
        clazz.title = fixtures.util.lorem.generateWords(100);
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.title.maxlength);
    });

});

describe('[db/models/class] - Valid title', () => {

    it('Should remove redundant spaces on valid class title', () => {
        clazz.title = '     superhard  class yo  ';
        fixtures.functions.models.testForValidModel(clazz);
        expect(clazz.title).to.equal('superhard class yo');
    });

});

describe('[db/models/class] - Undefined description', () => {

    it('Should validate if class description is undefined', () => {
        clazz.description = undefined;
        fixtures.functions.models.testForValidModel(clazz);
    })

});

describe('[db/models/class] - Invalid description', () => {

    const [descriptionMaxLength] = db.schemas.definitions.classDefinition.description.maxlength;

    it('Should not validate if class description has bad words', () => {
        clazz.description = 'You better pass this fucking class';
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.description.validate);
    });

    it(`Should not validate class description longer than ${ descriptionMaxLength } characters`, () => {
        clazz.description = fixtures.util.lorem.generateWords(250);
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.description.maxlength);
    });

});

describe('[db/models/class] - Valid description', () => {

    it('Should remove redundant spaces on valid class descriptions', () => {
        clazz.description = '    lmao    who wrote   this  ';
        fixtures.functions.models.testForValidModel(clazz);
        expect(clazz.description).to.equal('lmao who wrote this');
    });

});

describe('[db/models/class] - Undefined avatar', () => {

    it('Should validate class if avatar is undefined', () => {
        clazz.avatar = undefined;
        fixtures.functions.models.testForValidModel(clazz);
    });

});

describe('[db/models/class] - Invalid avatar', () => {

    it('Should not validate avatar that is not an image', () => {
        clazz.avatar = fixtures.shared.sampleFiles.documentFile;
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.avatar.validate);
    });

});

describe('[db/models/class] - Invalid time ranges', () => {

    it('Should not validate a class that has no time ranges', () => {
        clazz.timeRanges = [];
        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.timeRanges.validate);
    });

    it('Should not validate time ranges that are not incremental', () => {

        clazz.timeRanges = [
            {
                start: 30,
                end: 50
            },
            {
                start: 70,
                end: 90
            },
            {
                start: 85,
                end: 100
            }
        ];

        fixtures.functions.models.testForInvalidModel(clazz, db.schemas.definitions.classDefinition.timeRanges.validate);

    });
    
});

describe('[db/models/class] - Default archive', () => {

    it('Should default to false if archive flag is not specified', () => {
        expect(clazz.archive).to.equal(false);
    });

});

describe('[db/models/class] - Default grades', () => {

    it('Should default to 0-based class grades if not specified', () => {
        expect(clazz.grades.homeworks).to.equal(0);
        expect(clazz.grades.projects).to.equal(0);
        expect(clazz.grades.exams).to.equal(0);
    });

});

describe('[db/models/class] - Valid class', () => {

    it('Should validate a class that meets all validation requirements', () => {
        fixtures.functions.models.testForValidModel(clazz);
    });

});

describe('[db/models/class] - statics.findByIdAndCheckForSelfAssociation', () => {

    let classFindOneStub;
    
    const ids = {
        classId: clazz._id,
        studentId: new Types.ObjectId()
    };

    it('Should throw error if Class.findOne (called with right args) resolves null', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(null);
        await expect(db.models.Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        sinon.assert.calledOnceWithExactly(classFindOneStub, {
            _id: ids.classId
        });

    });

    it('Should throw error if class.user equals studentId (self-association)', async () => {

        clazz.user = ids.studentId;

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        await expect(db.models.Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfTeaching);

    });

    it('Should return class instance if all checks pass', async () => {
        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        await expect(db.models.Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.eql(clazz);
    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRoleStub;
    let classSaveStub;

    it('Should throw error if User.findByIdAndValidateRole (called with correct args) throws', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();
        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, clazz.user, util.roles.ROLE_TEACHER, {
            notFoundErrorMessage: util.errors.modelErrorMessages.teacherNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notATeacher
        });

    });

    it('Should throw error if class.save happens to fail', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);
        classSaveStub = sinon.stub(clazz, 'save').rejects();

        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classSaveStub);

    });

    it('Should return class model instance if all promises resolve properly', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);

        await expect(clazz.checkAndSave()).to.eventually.be.eql(clazz);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class] - methods.saveAvatar', () => {

    let deleteBucketObjectsStub;
    let classSaveStub;
    let createMultipartObjectStub;

    const pngImage = fixtures.shared.sampleFiles.pngImage;
    const buffer = Buffer.alloc(10);

    it('Should throw error if class avatar is defined but storage.deleteBucketObjects (called with correct args) fails', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').rejects();
        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, api.storage.config.bucketNames[shared.db.names.class.modelName], [clazz.avatar.keyname]);

    });

    it('Should throw error if class.save fails', async () => {

        clazz.avatar = undefined;
        classSaveStub = sinon.stub(clazz, 'save').rejects();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classSaveStub);

    });

    it('Should throw error if storage.createMultipartObject (called with correct args) fails; class avatar should be undefined', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').rejects();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        expect(clazz.avatar).to.be.undefined;

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.class.modelName], {
            keyname: sinon.match(util.regexp.fileKeyname),
            buffer,
            size: buffer.length,
            mimetype: pngImage.mimetype
        });

        sinon.assert.calledTwice(classSaveStub);

    });

    it('Should return class model instance if all required promises resolve properly', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.eql(clazz);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class] - methods.getEnabledStudentIds', () => {

    let classStudentAggregateStub;

    it('Should throw error if getEnabledClassStudentIds pipeline returns no docs (no students affiliated yet)', async () => {

        classStudentAggregateStub = sinon.stub(db.models.ClassStudent, 'aggregate').resolves([]);
        await expect(clazz.getEnabledStudentIds()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.noClassStudents);

        sinon.assert.calledOnceWithExactly(classStudentAggregateStub, shared.db.aggregation.classStudentPipelines.getEnabledClassStudentIds(clazz._id));

    });

    it('Should extract student ids on success pipeline data retrieval', async () => {

        const studentIds = [new Types.ObjectId(), new Types.ObjectId()];

        classStudentAggregateStub = sinon.stub(db.models.ClassStudent, 'aggregate').resolves([
            {
                _id: new Types.ObjectId,
                studentIds
            }
        ]);

        await expect(clazz.getEnabledStudentIds()).to.eventually.eql(studentIds);

    });

    afterEach(() => {
        sinon.restore();
    });

});
