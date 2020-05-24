const { homeworkFile, homeworkNote, homeworkSection, homeworkStudentSection, homeworkStudentFile, homeworkStudentNote, homework } = require('../../names');
const { class: clazz } = require('../../models');

const getDetailsForStudent = _id => [

    // get a single homeworkStudent record
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

    // LEFT JOIN homeworkStudents with homeworkStudentSections WHERE...
    {
        $lookup: {
            from: homeworkStudentSection.collectionName,

            // access homeworkStudent.published on nested pipeline
            let: {
                homeworkStudentId: '$_id',
                homeworkStudentPublished: '$published'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [

                                // homeworkStudents._id = homeworkStudentSections.homeworkStudent
                                {
                                    $eq: [
                                        '$$homeworkStudentPublished',
                                        true
                                    ]
                                },

                                // AND homeworkStudent.published === true; this is to avoid getting point records if
                                // the student grades are not published yet
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

                // GROUP homeworkStudentSection records by homeworkStudent foreign _id and sum points to get
                // student points for that homework
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

    // LEFT JOIN homeworkStudents with homeworkStudentSections WHERE homeworkStudents._id = homeworkStudentSections.homeworkStudent
    {
        $lookup: {
            from: homeworkStudentSection.collectionName,

            // access homeworkStudent.published on nested pipeline
            let: {
                homeworkStudentId: '$_id',
                homeworkStudentPublished: '$published'
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

                            // homeworkSection project: delete homework foreign _id and __v flag
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

                // homeworkStudentSections project, conditional points display and conserve section detailed data
                {
                    $project: {
                        points: {
                            $cond: [
                                
                                // if homeworkStudent.published
                                {
                                    $eq: [
                                        '$$homeworkStudentPublished',
                                        true
                                    ]
                                },

                                // display points assigned to the student on that homework section
                                '$points',

                                // if not, remove
                                '$$REMOVE'
                            ]
                        },
                        section: 1
                    }
                }
            ],
            as: 'sections'
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

                        // homework.published === true; students should NOT be able to see unpublished homeworks
                        published: true
                    }
                },

                // LEFT JOIN homeworks with homeworkFiles WHERE...
                {
                    $lookup: {
                        from: homeworkFile.collectionName,
                        let: {
                            homeworkId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {

                                    // homeworks._id = homeworkFiles.homework
                                    $expr: {
                                        $eq: [
                                            '$homework',
                                            '$$homeworkId'
                                        ]
                                    },

                                    // homeworkFiles.published === true; student should not be able to see unpublished
                                    // homework files
                                    published: true
                                }
                            },

                            // homeworkFiles project: delete published flag, homework foreign _id and __v value
                            {
                                $project: {
                                    published: 0,
                                    homework: 0,
                                    __v: 0
                                }
                            }
                        ],
                        as: 'files'
                    }
                },

                // LEFT JOIN homeworks with homeworkNotes WHERE...
                {
                    $lookup: {
                        from: homeworkNote.collectionName,
                        let: {
                            homeworkId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {

                                    // homeworks._id = homeworkNotes.homework
                                    $expr: {
                                        $eq: [
                                            '$homework',
                                            '$$homeworkId'
                                        ]
                                    },

                                    // homeworkNotes.published === true; student should not be able to see unpublished
                                    // homework notes
                                    published: true
                                }
                            },

                            // homeworkNotes project: just conserve note title
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

                // LEFT JOIN homeworks with homeworkSections where homeworks._id = homeworkSections.homework
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

                            // GROUP homeworkSections by homework foreign _id and sum points to get homework points
                            // (if sectioned)
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

                // homework project: delete published flag, class foreign _id and __v value
                {
                    $project: {
                        published: 0,
                        class: 0,
                        __v: 0
                    }
                }
            ],
            as: 'homework'
        }
    },
    {
        $unwind: '$homework'
    },

    // homeworkStudents project: detailed data
    // completed? forced? published? flags, homework detailed data
    // teacherComments conditional appearance
    // studentComments, published files and notes
    // sections conditional appearance
    // grade conditional appearance
    {
        $project: {
            completed: 1,
            forced: 1,
            published: 1,
            homework: 1,
            teacherComments: {
                $cond: [

                    // if homeworkStudent is published
                    {
                        $eq: [
                            '$published',
                            true
                        ]
                    },

                    // send teacher comments
                    '$teacherComments',

                    // if not, remove
                    '$$REMOVE'
                ]
            },
            studentComments: 1,
            files: 1,
            notes: 1,
            points: 1,
            sections: {
                $cond: [

                    // if homework type is not sectioned
                    {
                        $eq: [
                            clazz.gradeType.NO_SECTIONS,
                            '$homework.type'
                        ]
                    },

                    // remove
                    '$$REMOVE',

                    // if sectioned, conserve
                    '$sections'
                ]
            },
            grade: {
                $cond: [

                    // if homework is not sectioned
                    {
                        $eq: [
                            clazz.gradeType.NO_SECTIONS,
                            '$homework.type'
                        ]
                    },
                    {
                        $cond: [
                            
                            // ...and homeworkStudent is published
                            {
                                $eq: [
                                    '$published',
                                    true
                                ]
                            },

                            // send directGrade manually applied by professor
                            '$directGrade',

                            // if not, remove
                            '$$REMOVE'
                        ]
                    },

                    // if homework is sectioned
                    {
                        $cond: [

                            // ...and homeworkStudent is published
                            {
                                $eq: [
                                    '$published',
                                    true
                                ]
                            },

                            // calculate final homework grade as
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
];

module.exports = getDetailsForStudent;
