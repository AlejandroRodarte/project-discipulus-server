const { homeworkFile, homeworkNote, homeworkSection, homeworkStudent, classStudent, user, homeworkStudentSection } = require('../../names');
const { class: clazz } = require('../../models');

const getDetails = _id => [

    // match a single homework record
    {
        $match: { _id }
    },

    // LEFT JOIN homeworks with homeworkFiles WHERE homeworks._id = homeworkFiles.homework
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

                // homeworkFiles project: delete homework foreign _id and __v value
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

    // LEFT JOIN homeworks with homeworkNotes WHERE homeworks._id = homeworkNotes.homework
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

                // homeworkNotes proejct: keep published flag and note title
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

    // LEFT JOIN homeworks with homeworkSections WHERE homeworks._id = homeworkSections.homework
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

                // homeworkSection project: delete homework foreign _id and _v value
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

    // LEFT JOIN homeworks with homeworkSections WHERE homeworks._id = homeworkSections.homework
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

                // GROUP homeworkSections by homework foreign _id and sum points to get total points
                // the homework is worth
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

    // LEFT JOIN homeworks with homeworkStudents WHERE homeworks._id = homeworkStudents.homework
    {
        $lookup: {
            from: homeworkStudent.collectionName,

            // access homework.type, homework.points.sum and homework.grade inside nested pipeline
            let: {
                homeworkId: '$_id',
                homeworkType: '$type',
                sectionPoints: '$points.sum',
                homeworkGrade: '$grade'
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

                // LEFT JOIN homeworkStudents with classStudents WHERE homeworkStudents.classStudent = classStudents._id
                {
                    $lookup: {
                        from: classStudent.collectionName,
                        let: {
                            classStudentId: '$classStudent'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$classStudentId'
                                        ]
                                    }
                                }
                            },

                            // LEFT JOIN classStudents with users WHERE classStudents.user = users._id
                            {
                                $lookup: {
                                    from: user.collectionName,
                                    let: {
                                        userId: '$user'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: [
                                                        '$_id',
                                                        '$$userId'
                                                    ]
                                                }
                                            }
                                        },

                                        // users project: get name, username and avatar file _id
                                        {
                                            $project: {
                                                name: 1,
                                                username: 1,
                                                avatar: {
                                                    _id: 1
                                                }
                                            }
                                        }
                                    ],
                                    as: 'user'
                                }
                            },
                            {
                                $unwind: '$user'
                            },

                            // classStudent project: get only user summary data
                            {
                                $project: {
                                    user: 1
                                }
                            }
                        ],
                        as: 'classStudent'
                    }
                },
                {
                    $unwind: '$classStudent'
                },

                // LEFT JOIN homeworkStudents with homeworkStudentSections WHERE homeworkStudents._id = homeworkStudentSections.homeworkStudent
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

                            // GROUP homeworkStudentSection records by homeworkStudent foreign _id and sum points
                            // to get student accumulated points for that homework
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

                // homeworkStudent project: get summary data
                // completed? published? forced? flags, classStudent relevant data and homeworkStudent points (if sectioned)
                // conditional grade value
                {
                    $project: {
                        completed: 1,
                        published: 1,
                        forced: 1,
                        classStudent: 1,
                        points: 1,
                        grade: {
                            $cond: [

                                // if homework if sectioned
                                {
                                    $eq: [
                                        clazz.gradeType.SECTIONS,
                                        '$$homeworkType'
                                    ]
                                },

                                // calculate grade by
                                // (homeworkGrade) * (studentPoints / homeworkPoints)
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

                                // if not sectioned, assign it the directGrade value
                                '$directGrade'
                            ]
                        }
                    }
                }
            ],
            as: 'students'
        }
    },

    // homework project: get detailed data
    // timeRange, published? flag, title, description, type, grade, student-homework data
    // homework points, files and notes
    {
        $project: {
            timeRange: 1,
            published: 1,
            title: 1,
            description: 1,
            type: 1,
            grade: 1,
            students: 1,
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
