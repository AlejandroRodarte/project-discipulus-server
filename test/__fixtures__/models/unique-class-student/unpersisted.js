const { Types } = require('mongoose');

const { classStudent } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClassStudents = persisted[classStudent.modelName];

const classStudents = [

    // 0. same class/user combo as classStudent[0]
    {
        class: persistedClassStudents[0].class,
        user: persistedClassStudents[0].user
    },

    // 1. same class, different user
    {
        class: persistedClassStudents[0].class,
        user: new Types.ObjectId()
    },

    // 2. same user, different class
    {
        class: new Types.ObjectId(),
        user: persistedClassStudents[0].user
    },

    // 3. different class/user
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
    
];

module.exports = {
    [classStudent.modelName]: classStudents
};
