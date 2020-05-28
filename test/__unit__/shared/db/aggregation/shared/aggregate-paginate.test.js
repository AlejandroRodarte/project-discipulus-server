const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation, names, models } = require('../../../../../../src/shared/db');

let args;

beforeEach(() => args = {
    match: {
        $expr: {
            $eq: [
                '$homework',
                '$$homeworkId'
            ]
        }
    },
    middle: {
        include: true,
        pipeline: [
            {
                $lookup: {
                    from: names.classStudent.collectionName,
                    localField: '_id',
                    foreignField: 'classStudent',
                    as: 'classStudent'
                }
            },
            {
                $unwind: '$classStudent'
            }
        ]
    },
    sort: {
        baseField: false,
        pipeline: [
            {
                $lookup: {
                    from: names.homeworkStudentSection.collectionName,
                    let: {
                        homeworkStudentId: '$_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        '$homeworkStudent',
                                        '$$homeworkStudentId'
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: '$homeworkStudent',
                                sum: {
                                    $sum: '$points'
                                }
                            }
                        }
                    ],
                    as: 'points'
                }
            },
            {
                $unwind: '$points'
            }
        ],
        params: {
            fieldName: 'points.sum',
            order: 1
        }
    },
    page: 1,
    limit: 1,
    pipeline: [
        {
            $project: {
                completed: 1,
                published: 1,
                forced: 1,
                classStudent: 1,
                points: 1,
                grade: {
                    $cond: [
                        {
                            $eq: [
                                models.class.gradeType.SECTIONS,
                                '$$homeworkType'
                            ]
                        },
                        {
                            $multiply: [
                                '$$homeworkGrade',
                                {
                                    $divide: [
                                        '$points.sum',
                                        '$$sectionPoints'
                                    ]
                                }
                            ]
                        },
                        '$directGrade'
                    ]
                }
            }
        }
    ]
});

describe('[shared/db/aggregation/shared/aggregate-pipeline] - general flow', () => {

    it('First pipeline stage should be the $match one', () => {
        const [firstStage] = aggregation.sharedPipelines.aggregatePaginate(args);
        expect(firstStage.$match).to.eql(args.match);
    });

    it('Should not include middle pipeline if include flag is false', () => {

        args.middle.include = false;
        const [, secondStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(secondStage).to.not.eql(args.middle.pipeline[0]);

    });

    it('Should include middle pipeline if include flag is true', () => {

        const [, secondStage, thirdStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(secondStage).to.eql(args.middle.pipeline[0]);
        expect(thirdStage).to.eql(args.middle.pipeline[1]);

    });

    it('Should not include sort pipeline if baseField flag is set to true', () => {

        args.sort.baseField = true;
        const [,,, fourthStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(fourthStage).to.not.eql(args.sort.pipeline[0]);

    });

    it('Should include sort pipeline if baseField flag is set to false', () => {

        const [,,, fourthStage, fifthStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(fourthStage).to.eql(args.sort.pipeline[0]);
        expect(fifthStage).to.eql(args.sort.pipeline[1]);

    });

    it('Should include $sort stage', () => {

        const [,,,,, sixthStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(sixthStage.$sort).to.eql({
            [args.sort.params.fieldName]: args.sort.params.order
        });

    });

    it('Should include $facet with metadata', () => {

        const [,,,,,, seventhStage] = aggregation.sharedPipelines.aggregatePaginate(args);

        expect(seventhStage.$facet.metadata[1].$addFields.limit).to.equal(args.limit);
        expect(seventhStage.$facet.metadata[1].$addFields.totalPages.$ceil.$divide[1]).to.equal(args.limit);
        expect(seventhStage.$facet.metadata[1].$addFields.page).to.equal(args.page);

        expect(seventhStage.$facet.metadata[2].$addFields.hasPrevPage.$cond[0].$eq[1]).to.equal(args.page);
        expect(seventhStage.$facet.metadata[2].$addFields.prevPage.$cond[0].$eq[1]).to.equal(args.page);

        expect(seventhStage.$facet.docs[0].$skip).to.equal((args.page - 1) * args.limit);
        expect(seventhStage.$facet.docs[1].$limit).to.equal(args.limit);
        expect(seventhStage.$facet.docs[2]).to.eql(args.pipeline[0]);

    });

});
