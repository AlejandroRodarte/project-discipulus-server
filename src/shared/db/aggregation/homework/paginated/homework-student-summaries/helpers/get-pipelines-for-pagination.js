const { getUserInfo, homeworkStudentProject, homeworkStudentSectionPointsSum } = require('../stages');
const { rules } = require('../values');

const getPipelinesForPagination = (
    userMatch = {}, 
    queryRules = {
        match: rules.types.NONE,
        sort: rules.types.NONE
    }
) => {

    const middlePipeline = [];
    const sortPipeline = [];
    const docsPipeline = [];

    if (queryRules.match === rules.types.USER || queryRules.sort === rules.types.USER) {
        middlePipeline.push(
            ...getUserInfo(userMatch)
        );
    } else {
        docsPipeline.push(
            ...getUserInfo()
        );
    }

    switch (queryRules.sort) {

        case rules.types.POINTS_SUM:
            sortPipeline.push(
                ...homeworkStudentSectionPointsSum
            );
            docsPipeline.push(
                ...homeworkStudentProject
            );
            break;

        case rules.types.GRADE:
            sortPipeline.push(
                ...homeworkStudentSectionPointsSum,
                ...homeworkStudentProject
            );
            break;

        case rules.types.NONE:
        case rules.types.USER:
            docsPipeline.push(
                ...homeworkStudentSectionPointsSum,
                ...homeworkStudentProject
            );
            break;

        default:
            break;

    }

    return [middlePipeline, sortPipeline, docsPipeline];

};

module.exports = getPipelinesForPagination;
