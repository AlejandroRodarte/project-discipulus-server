const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/shared] - getTaskValidationData', () => {

    it('Should return proper pipeline object', () => {

        const _id = new Types.ObjectId();

        const args = {
            child: {
                collectionName: names.homeworkStudent.collectionName,
                ref: 'homeworkStudent'
            },
            grandChildOne: {
                collectionName: names.classStudent.collectionName,
                ref: 'classStudent',
                forcedFlagRef: 'forceHomeworkUpload'
            },
            grandChildTwo: {
                collectionName: names.homework.collectionName,
                ref: 'homework'
            }
        };

        const pipeline = aggregation.sharedPipelines.getTaskValidationData(_id, args);

        expect(pipeline.length).to.equal(4);

        const [firstStage, secondStage, thirdStage, fourthStage] = pipeline;
        
        expect(firstStage.$match._id).to.equal(_id);

        expect(secondStage.$lookup.from).to.equal(args.child.collectionName);
        expect(secondStage.$lookup.let.childId).to.equal(`$${ args.child.ref }`);

        expect(secondStage.$lookup.pipeline[1].$lookup.from).to.equal(args.grandChildOne.collectionName);
        expect(secondStage.$lookup.pipeline[1].$lookup.let.grandChildOneId).to.equal(`$${ args.grandChildOne.ref }`);
        expect(secondStage.$lookup.pipeline[1].$lookup.as).to.equal(args.grandChildOne.ref);

        expect(secondStage.$lookup.pipeline[2].$unwind).to.equal(`$${ args.grandChildOne.ref }`);

        expect(secondStage.$lookup.pipeline[3].$lookup.from).to.equal(args.grandChildTwo.collectionName);
        expect(secondStage.$lookup.pipeline[3].$lookup.let.grandChildTwoId).to.equal(`$${ args.grandChildTwo.ref }`);
        expect(secondStage.$lookup.pipeline[3].$lookup.as).to.equal(args.grandChildTwo.ref);

        expect(secondStage.$lookup.pipeline[4].$unwind).to.equal(`$${ args.grandChildTwo.ref }`);

        expect(secondStage.$lookup.as).to.equal(args.child.ref);

        expect(thirdStage.$unwind).to.equal(`$${ args.child.ref }`);

        expect(fourthStage.$project.completed).to.equal(`$${ args.child.ref }.completed`)
        expect(fourthStage.$project.forced).to.equal(`$${ args.child.ref }.${ args.grandChildOne.ref }.${ args.grandChildOne.forcedFlagRef }`)
        expect(fourthStage.$project.end.$ifNull).to.eql([ `$${ args.child.ref }.${ args.grandChildTwo.ref }.timeRange.end`, undefined ]);

    });

});
