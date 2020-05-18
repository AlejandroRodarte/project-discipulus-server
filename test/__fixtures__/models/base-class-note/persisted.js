const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const classes = [
    // 0: sample class
    ...util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ])
];

const classNotes = [
    // 0-1: class[0] with two notes
    ...util.generateOneToMany('class', classes[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.class.modelName]: classes,
    [db.names.classNote.modelName]: classNotes
};
