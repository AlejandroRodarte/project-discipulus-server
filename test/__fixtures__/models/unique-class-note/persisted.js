const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const classes = [
    // 0: generate one sample class
    ...util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ])
];

const classNotes = [
    // 0: class[0] with sample note
    ...util.generateOneToMany('class', classes[0]._id, [{ note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.class.modelName]: classes,
    [db.names.classNote.modelName]: classNotes
};
