const { homeworkStudentSection } = require('../../../../../names');

const homeworkStudentSectionPointsSum = (restricted = true) => {

    const letVars = {
        homeworkStudentId : '$_id'
    };

    const matchExpr = {};

    if (restricted) {
        
        letVars.homeworkStudentPublished = '$published';

        matchExpr.$and = [
            {
                $eq: [
                    '$$homeworkStudentPublished',
                    true
                ]
            },
            {
                $eq: [
                    '$homeworkStudent',
                    '$$homeworkStudentId'
                ]
            }
        ];

    } else {

        matchExpr.$eq = [
            '$homeworkStudent',
            '$$homeworkStudentId'
        ];

    }

    return [
        {
            $lookup: {
                from: homeworkStudentSection.collectionName,
                let: letVars,
                pipeline: [
                    {
                        $match: {
                            $expr: matchExpr
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
            $unwind: {
                path: '$points',
                preserveNullAndEmptyArrays: true
            }
        }
    ];

};

module.exports = homeworkStudentSectionPointsSum;
