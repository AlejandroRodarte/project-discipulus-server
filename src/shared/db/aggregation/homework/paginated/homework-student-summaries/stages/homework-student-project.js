const { class: clazz } = require('../../../../../models');

module.exports = [
    {
        $project: {
            completed: 1,
            published: 1,
            forced: 1,
            classStudent: 1,
            points: 1,
            grade: {
                $cond: [
                    {
                        $eq: [
                            clazz.gradeType.SECTIONS,
                            '$$homeworkType'
                        ]
                    },
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
                    '$directGrade'
                ]
            }
        }
    }
];