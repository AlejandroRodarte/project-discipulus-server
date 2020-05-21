const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedSessions = persisted[db.names.session.modelName];
const persistedSessionNotes = persisted[db.names.sessionNote.modelName];

const sessionNotes = [
    ...util.generateOneToMany('session', persistedSessions[0]._id, [

        // 0: session[0] with note that has same tutle as sessionNote[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedSessionNotes[0].note.title
            }
        },

        // 1: session[0] with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.sessionNote.modelName]: sessionNotes
};
