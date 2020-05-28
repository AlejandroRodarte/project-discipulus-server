const { class: clazz } = require('../../../../../models');

const homeworkStudentProject = (restricted = true) => {

    const grade = {};

    if (restricted) {

        grade.$cond = [
            {
                $eq: [
                    clazz.gradeType.NO_SECTIONS,
                    '$homework.type'
                ]
            },
            {
                $cond: [
                    {
                        $eq: [
                            '$published',
                            true
                        ]
                    },
                    '$directGrade',
                    '$$REMOVE'
                ]
            },
            {
                $cond: [
                    {
                        $eq: [
                            '$published',
                            true
                        ]
                    },
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
                    '$$REMOVE'
                ]
            }
        ];

    } else {

        grade.$cond = [
            {
                $eq: [
                    clazz.gradeType.NO_SECTIONS,
                    '$homework.type'
                ]
            },
            '$directGrade',
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
            }
        ];

    }

    return [
        {
            $project: {
                completed: 1,
                forced: 1,
                published: 1,
                homework: 1,
                points: 1,
                grade
            }
        }
    ];

};

module.exports = homeworkStudentProject;
