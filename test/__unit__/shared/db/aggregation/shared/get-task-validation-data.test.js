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
            grandChild: {
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

        expect(secondStage.$lookup.pipeline[1].$lookup.from).to.equal(args.grandChild.collectionName);
        expect(secondStage.$lookup.pipeline[1].$lookup.let.grandChildId).to.equal(`$${ args.grandChild.ref }`);
        expect(secondStage.$lookup.pipeline[1].$lookup.as).to.equal(args.grandChild.ref);

        expect(secondStage.$lookup.pipeline[2].$unwind).to.equal(`$${ args.grandChild.ref }`);

        expect(secondStage.$lookup.as).to.equal(args.child.ref);

        expect(thirdStage.$unwind).to.equal(`$${ args.child.ref }`);

        expect(fourthStage.$project.completed).to.equal(`$${ args.child.ref }.completed`)
        expect(fourthStage.$project.forced).to.equal(`$${ args.child.ref }.forced`)
        expect(fourthStage.$project.end.$ifNull).to.eql([ `$${ args.child.ref }.${ args.grandChild.ref }.timeRange.end`, undefined ]);

    });

});
