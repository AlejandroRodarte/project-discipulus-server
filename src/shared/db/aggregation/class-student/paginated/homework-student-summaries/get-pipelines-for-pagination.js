const { homework } = require('../../../../names');
const { getHomeworkSectionPointsSum, getHomeworkStudentProject, getHomeworkStudentSectionPointsSum } = require('./stages');
const { rules } = require('./values');

const getPipelinesForPagination = (
    restricted = true, 
    requiresMiddlePipeline = false, 
    homeworkMatch = {}, 
    sortBy = rules.types.NONE
) => {

    // get specific pipelines for this query
    const homeworkStudentSectionPointsSum = getHomeworkStudentSectionPointsSum(restricted);
    const homeworkSectionPointsSum = getHomeworkSectionPointsSum();
    const homeworkStudentProject = getHomeworkStudentProject(restricted);

    const nestedPipeline = [];
    const sortPipeline = [];
    const docsPipeline = [];

    if (requiresMiddlePipeline) {

        // if a middle pipeline for homework-related data is required, push it into the nested pipeline
        // along with its corresponding matches
        nestedPipeline.push(
            {
                $lookup: {
                    from: homework.collectionName,
                    let: {
                        homeworkId: '$homework'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        '$_id',
                                        '$$homeworkId'
                                    ]
                                },
                                ...homeworkMatch
                            }
                        }
                    ],
                    as: 'homeworkData'
                }
            },
            {
                $unwind: '$homeworkData'
            }
        );

    }

    switch (sortBy) {

        case rules.types.POINTS_SUM:
            sortPipeline.push(
                ...homeworkStudentSectionPointsSum
            );
            docsPipeline.push(
                ...homeworkSectionPointsSum,
                ...homeworkStudentProject
            );
            break;

        case rules.types.HOMEWORK_POINTS_SUM:
            sortPipeline.push(
                ...homeworkSectionPointsSum
            );
            docsPipeline.push(
                ...homeworkStudentSectionPointsSum,
                ...homeworkStudentProject
            );
            break;

        case rules.types.GRADE:
            sortPipeline.push(
                ...homeworkStudentSectionPointsSum,
                ...homeworkSectionPointsSum,
                ...homeworkStudentProject
            );
            break;

        case rules.types.NONE:
            docsPipeline.push(
                ...homeworkStudentSectionPointsSum,
                ...homeworkSectionPointsSum,
                ...homeworkStudentProject
            );

        default:
            break;

    }

    return [nestedPipeline, sortPipeline, docsPipeline];

};

module.exports = getPipelinesForPagination;
