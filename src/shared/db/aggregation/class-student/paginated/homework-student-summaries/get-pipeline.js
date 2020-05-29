const { homeworkStudent } = require('../../../../names');

const shared = require('../../../shared');
const helpers = require('./helpers');
const values = require('./values');

const getPipeline = (
    _id, 
    restricted = true, 
    {
        page = 1,
        limit = 10,
        completed = undefined,
        forced = undefined,
        published = undefined,
        'homework.title': homeworkTitle = undefined,
        'homework.type': homeworkType = undefined,
        orderBy = '_id,asc'
    }
) => {

    // matches at the root collection level (HomeworkStudent)
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

    // matches at a nested level (Homework join where homeworkStudent.homework = homework._id)
    const homeworkMatch = {};

    if (homeworkTitle !== undefined) {
        homeworkMatch.title = {
            $regex: `^${ homeworkTitle }`,
            $options: 'i'
        }
    }

    if (homeworkType !== undefined) {
        homeworkMatch.type = homeworkType;
    }

    // restrict to only published homeworks
    if (restricted) {
        homeworkMatch.published = true;
    }

    // if homeworkMatch is not empty at this point, it means that we will match
    // by homework-related data, a nested object
    const requiresHomeworkMatches = Object.keys(homeworkMatch).length > 0;

    // extract sortBy field and determine if it requires special treatment by getting
    // its special sorting rule type
    const [field, order] = orderBy.split(',');
    const rule = values.rules.sort[field] || values.rules.sort.NONE;

    const hasSortRule = rule !== values.rules.sort.NONE;
    const requiresSortMapper = values.sortMapper[field] !== undefined;

    // a middle pipeline (to join homework-related data) is required if...
    // 1. a sort mapper exists (homework.title -> homeworkData.title)
    // 2. homework matches exist (homework.title or homework.type)
    const requiresMiddlePipeline = requiresSortMapper || requiresHomeworkMatches;

    // get pipelines for aggregatePipeline
    const [middlePipeline, sortPipeline, docsPipeline] = helpers.getPipelinesForPagination({
        restricted,
        requiresMiddlePipeline,
        homeworkMatch,
        rule
    });

    const pipeline = [
        {
            $match: { _id }
        },
        {
            $lookup: {
                from: homeworkStudent.collectionName,
                let: {
                    classStudentId: '$_id'
                },
                pipeline: shared.aggregatePaginate(
                    {
                        match: {
                            $expr: {
                                $eq: [
                                    '$classStudent',
                                    '$$classStudentId'
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
                                fieldName: requiresSortMapper ? values.sortMapper[field] : field,
                                order: order === 'asc' ? 1 : -1
                            }
                        },
                        page,
                        limit,
                        pipeline: docsPipeline
                    }    
                ),
                as: 'homeworks'
            }
        },
        {
            $project: {
                homeworks: 1
            }
        }
    ];

    return pipeline;

};

module.exports = getPipeline;
