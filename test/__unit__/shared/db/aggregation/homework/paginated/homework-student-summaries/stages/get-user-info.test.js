const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/stages/get-user-info] - general flow', () => {

    it('Should produce correct pipeline', () => {

        const userMatchObj = {
            name: {
                $regex: '^sample',
                $options: 1
            }
        };

        const [classStudentLookup] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(userMatchObj);
        const { pipeline: classStudentPipeline } = classStudentLookup.$lookup;
        const [, userLookup] = classStudentPipeline;
        const { pipeline: userPipeline } = userLookup.$lookup;
        const [userMatch] = userPipeline;

        expect(userMatch.$match).to.eql({
            $expr: {
                $eq: [
                    '$_id',
                    '$$userId'
                ]
            },
            ...userMatchObj
        });


    });

});
