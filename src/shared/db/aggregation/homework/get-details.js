const { homeworkFile, homeworkNote, homeworkSection } = require('../../names');
const { class: clazz } = require('../../models');

const getDetails = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: homeworkFile.collectionName,
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
                    $project: {
                        homework: 0,
                        __v: 0
                    }
                }
            ],
            as: 'files'
        }
    },
    {
        $lookup: {
            from: homeworkNote.collectionName,
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
                    $project: {
                        published: 1,
                        note: {
                            title: 1
                        }
                    }
                }
            ],
            as: 'notes'
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
                    $project: {
                        homework: 0,
                        __v: 0
                    }
                }
            ],
            as: 'sections'
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
            published: 1,
            title: 1,
            description: 1,
            type: 1,
            grade: 1,
            points: 1,
            files: 1,
            notes: 1,
            sections: {
                $cond: [
                    {
                        $eq: [
                            '$type',
                            clazz.gradeType.NO_SECTIONS
                        ]
                    },
                    '$$REMOVE',
                    '$sections'
                ]
            }
        }
    }
];

module.exports = getDetails;
