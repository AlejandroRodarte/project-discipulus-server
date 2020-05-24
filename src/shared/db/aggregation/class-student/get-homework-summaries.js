const { homeworkStudent, homeworkStudentSection, homework, homeworkSection } = require('../../names');
const { class: clazz } = require('../../models');

const getHomeworkSummaries = _id => [

    // match a single class student
    {
        $match: { _id }
    },

    // LEFT JOIN classStudents with homeworkStudents WHERE classStudent._id = homeworkStudent.classStudent
    {
        $lookup: {
            from: homeworkStudent.collectionName,
            let: {
                classStudentId: '$_id'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                '$classStudent',
                                '$$classStudentId'
                            ]
                        }
                    }
                },

                // LEFT JOIN homeworkStudents with homeworkStudentSections WHERE...
                {
                    $lookup: {
                        from: homeworkStudentSection.collectionName,
                        
                        // access homeworkStudent.published inside nested pipeline
                        let: {
                            homeworkStudentId: '$_id',
                            homeworkStudentPublished: '$published'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [

                                            // homeworkStudent.published === true
                                            // this is to avoid fetching section grades if student results are not published yet
                                            {
                                                $eq: [
                                                    '$$homeworkStudentPublished',
                                                    true
                                                ]
                                            },

                                            // AND homeworkStudents._id = homeworkStudentSections.homeworkStudent
                                            {
                                                $eq: [
                                                    '$homeworkStudent',
                                                    '$$homeworkStudentId'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },

                            // GROUP homeworkStudentSections by homeworkStudent foreign _id and sum points to get total student points
                            // for that homework
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
                },

                // LEFT JOIN homeworkStudents with homework WHERE...
                {
                    $lookup: {
                        from: homework.collectionName,
                        let: {
                            homeworkId: '$homework'
                        },
                        pipeline: [
                            {
                                $match: {

                                    // homeworkStudents.homework = homework._id
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$homeworkId'
                                        ]
                                    },

                                    // AND homework.published === true; students should not be able to see unpublished class homeworks
                                    published: true
                                }
                            },

                            // LEFT JOIN homework with homeworkSections WHERE homework._id = homeworkSections.homework
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

                                        // GROUP homeworkSections by homework foreign _id and sum points to get how much points is the
                                        // homework worth
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

                            // homework project: display summary data
                            // due date, title, type, grade and points (if sectioned)
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
                },

                // homeworkStudent project: display summary data
                // completed?, forced? and published? flags, homework summary data
                // points assigned to the homework (if sectioned) and grade
                {
                    $project: {
                        completed: 1,
                        forced: 1,
                        published: 1,
                        homework: 1,
                        points: 1,
                        grade: {
                            $cond: [

                                // if homework is not sectioned...
                                {
                                    $eq: [
                                        clazz.gradeType.NO_SECTIONS,
                                        '$homework.type'
                                    ]
                                },
                                {
                                    $cond: [

                                        // and if the homeworkStudent is itself published by the teacher...
                                        {
                                            $eq: [
                                                '$published',
                                                true
                                            ]
                                        },

                                        // grade = directGrade manually provided by the teacher
                                        '$directGrade',

                                        // if not, remove
                                        '$$REMOVE'
                                    ]
                                },

                                // if homework is sectioned...
                                {
                                    $cond: [

                                        // and published...
                                        {
                                            $eq: [
                                                '$published',
                                                true
                                            ]
                                        },

                                        // calculate grade as
                                        // (homeworkGrade) * (studentPoints / homeworkPoints)
                                        {
                                            $multiply: [
                                                '$homework.grade',
                                                {
                                                    $divide: [
                                                        '$points.sum',
                                                        '$homework.points.sum'
                                                    ]
                                                }
                                            ]
                                        },

                                        // if not, remove
                                        '$$REMOVE'
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            as: 'homeworks'
        }
    },

    // classStudent project: just conserve homeworks summary
    {
        $project: {
            homeworks: 1
        }
    }
];

module.exports = getHomeworkSummaries;
