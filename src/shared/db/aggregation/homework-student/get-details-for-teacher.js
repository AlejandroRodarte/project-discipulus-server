const { homeworkSection, homeworkStudentSection, homeworkStudentFile, homeworkStudentNote, homework, classStudent, user } = require('../../names');
const { class: clazz } = require('../../models');


const getDetailsForTeacher = _id => [

    // match a single homeworkStudent record by id
    {
        $match: { _id }
    },

    // LEFT JOIN homeworkStudents with homeworkStudentFiles WHERE homeworkStudents._id = homeworkStudentFiles.homeworkStudent
    {
        $lookup: {
            from: homeworkStudentFile.collectionName,
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

                // homeworkStudentFiles project: delete foreign _id and __v values
                {
                    $project: {
                        homeworkStudent: 0,
                        __v: 0
                    }
                }
            ],
            as: 'files'
        }
    },

    // LEFT JOIN homeworkStudents with homeworkStudentNotes WHERE homeworkStudents._id = homeworkStudentNotes.homeworkStudent
    {
        $lookup: {
            from: homeworkStudentNote.collectionName,
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

                // homeworkStudentNotes project: just conserve note title (with ids)
                {
                    $project: {
                        note: {
                            title: 1
                        }
                    }
                }
            ],
            as: 'notes'
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
                            
                            // users project: get name, username, email and avatar file _id
                            {
                                $project: {
                                    name: 1,
                                    username: 1,
                                    email: 1,
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

                // classStudent project: just get user data
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

    // LEFT JOIN homeworkStudents with homeworks WHERE homeworkStudents.homework = homeworks._id
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

                            // GROUP homeworkSection records by homework foreign _id to get total points assigned
                            // to the homework
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

                // homework project: get grade, points and type
                {
                    $project: {
                        grade: 1,
                        points: 1,
                        type: 1
                    }
                }
            ],
            as: 'homework'
        }
    },
    {
        $unwind: '$homework'
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

                // LEFT JOIN homeworkStudentSections with homeworkSections WHERE homeworkStudentSections.homeworkSection = homeworkSections._id
                {
                    $lookup: {
                        from: homeworkSection.collectionName,
                        let: {
                            homeworkSectionId: '$homeworkSection'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$homeworkSectionId'
                                        ]
                                    }
                                }
                            },

                            // homeworkSections project: delete homework foreign _id and __v value
                            {
                                $project: {
                                    homework: 0,
                                    __v: 0
                                }
                            }
                        ],
                        as: 'section'
                    }
                },
                {
                    $unwind: '$section'
                },

                // homeworkStudentSections project: conserve student points per individual section and section data
                {
                    $project: {
                        points: 1,
                        section: 1
                    }
                }
            ],
            as: 'sections'
        }
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

                // GROUP homeworkStudentSection records by homeworkStudent foreign _id and sum points to get total
                // points the student has for that homework
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

    // homeworkStudent project: detailed data
    // completed? forced? published? flags
    // homework summary data, classStudent summary data
    // files and notes for that homework
    // student comments and teacher comments too
    // sections conditionally sent
    // homeworkStudent points included
    // grade conditional value
    {
        $project: {
            completed: 1,
            forced: 1,
            published: 1,
            homework: 1,
            classStudent: 1,
            studentComments: 1,
            teacherComments: 1,
            files: 1,
            notes: 1,
            sections: {
                $cond: [

                    // if homework is sectioned
                    {
                        $eq: [
                            '$homework.type',
                            clazz.gradeType.SECTIONS
                        ]
                    },

                    // get sections
                    '$sections',

                    // if not, remove
                    '$$REMOVE'
                ]
            },
            points: 1,
            grade: {
                $cond: [

                    // if homework is sectioned
                    {
                        $eq: [
                            clazz.gradeType.SECTIONS,
                            '$homework.type'
                        ]
                    },

                    // calculate final grade
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

                    // if not sectioned, set direct grade provided by professor
                    '$directGrade'
                ]
            }
        }
    }
];

module.exports = getDetailsForTeacher;
