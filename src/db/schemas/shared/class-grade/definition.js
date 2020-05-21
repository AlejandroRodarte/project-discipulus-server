const sharedClassGradeDefinition = {

    homeworks: {
        type: Number,
        required: [true, 'A homeworks grade is required'],
        min: [0, 'Provide a homeworks grade higher than 0'],
        max: [10000, 'Provide a homeworks grade lower than 10000']
    },

    projects: {
        type: Number,
        required: [true, 'A projects grade is required'],
        min: [0, 'Provide a projects grade higher than 0'],
        max: [10000, 'Provide a projects grade lower than 10000']
    },

    exams: {
        type: Number,
        required: [true, 'An exams grade is required'],
        min: [0, 'Provide a exams grade higher than 0'],
        max: [10000, 'Provide a exams grade lower than 10000']
    }

};

module.exports = sharedClassGradeDefinition;
