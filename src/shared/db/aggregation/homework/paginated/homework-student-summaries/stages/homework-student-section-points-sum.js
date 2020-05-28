const { homeworkStudentSection } = require('../../../../../names');

module.exports = [
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