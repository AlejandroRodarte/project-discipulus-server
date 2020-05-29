const { homeworkSection, homeworkStudent } = require('../../../../names');
const shared = require('../../../shared');

const helpers = require('./helpers');
const values = require('./values');

const getPipeline = (
    _id,
    {
        page = 1,
        limit = 10,
        completed = undefined,
        forced = undefined,
        published = undefined,
        'user.name': userName = undefined,
        'user.username': userUsername = undefined,
        orderBy = '_id,asc'
    }
) => {

    const homeworkStudentMatch = {};

    if (completed !== undefined) {
        homeworkStudentMatch.completed = completed;
    }

    if (forced !== undefined) {
        homeworkStudentMatch.forced = forced;
    }

    if (published !== undefined) {
        homeworkStudentMatch.published = published;
    }

    const userMatch = {};

    if (userName !== undefined) {
        userMatch.name = {
            $regex: `^${ userName }`,
            $options: 'i'
        }
    }

    if (userUsername !== undefined) {
        userMatch.username = {
            $regex: `^${ userUsername }`,
            $options: 'i'
        }
    }

    const [field, order] = orderBy.split(',');

    const queryRules = {
        match: Object.keys(userMatch).length > 0 ? values.rules.types.USER : values.rules.types.NONE,
        sort: values.rules.sort[field] || values.rules.types.NONE
    };

    const hasSortRule = queryRules.sort !== values.rules.types.NONE;
    const hasSortMapper = values.sortMapper[field] !== undefined;

    const [middlePipeline, sortPipeline, docsPipeline] = helpers.getPipelinesForPagination(userMatch, queryRules);

    const pipeline = [
        {
            $match: { _id }
        },
        {
            $lookup: {
                from: homeworkSection.collectionName,
                let: {
                    homeworkId: '$_id'
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    '$homework',
                                    '$$homeworkId'
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$homework',
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
            $unwind: {
                path: '$points',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: homeworkStudent.collectionName,
                let: {
                    homeworkId: '$_id',
                    homeworkType: '$type',
                    sectionPoints: '$points.sum',
                    homeworkGrade: '$grade'
                },
                pipeline: shared.aggregatePaginate(
                    {
                        match: {
                            $expr: {
                                $eq: [
                                    '$homework',
                                    '$$homeworkId'
                                ]
                            },
                            ...homeworkStudentMatch
                        },
                        middle: {
                            include: true,
                            pipeline: middlePipeline
                        },
                        sort: {
                            baseField: !hasSortRule,
                            pipeline: sortPipeline,
                            params: {
                                fieldName: hasSortRule && hasSortMapper ? values.sortMapper[field] : field,
                                order: order === 'asc' ? 1 : -1
                            }
                        },
                        page,
                        limit,
                        pipeline: docsPipeline
                    }
                ),
                as: 'students'
            }
        },
        {
            $project: {
                students: 1
            }
        }
    ];

    return pipeline;

};

module.exports = getPipeline;
