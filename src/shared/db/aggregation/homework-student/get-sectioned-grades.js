const { homeworkStudentSection, homework, homeworkSection } = require('../../names');

const getSectionedGrades = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: homeworkStudentSection.collectionName,
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
            as: 'studentPoints'
        }
    },
    {
        $unwind: '$studentPoints'
    },
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
                    $unwind: '$points'
                }
            ],
            as: 'homework'
        }
    },
    {
        $unwind: '$homework'
    },
    {
        $project: {
            homework: {
                grade: '$homework.grade',
                points: '$homework.points.sum'
            },
            student: {
                points: '$studentPoints.sum'
            }
        }
    }
];

module.exports = getSectionedGrades;
