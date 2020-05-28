const { homework, homeworkSection } = require('../../../../../names');

const homeworkSectionPointsSum = () => [
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
                        }
                    }
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
                    $project: {
                        timeRange: 1,
                        title: 1,
                        type: 1,
                        grade: 1,
                        points: 1
                    }
                }
            ],
            as: 'homework'
        }
    },
    {
        $unwind: '$homework'
    }
];

module.exports = homeworkSectionPointsSum;
