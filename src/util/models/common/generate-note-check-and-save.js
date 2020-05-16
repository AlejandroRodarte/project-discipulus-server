const generateNoteCheckAndSave = validate => async function() {

    const noteDoc = this;

    try {
        await validate(noteDoc);
        await noteDoc.save();
    } catch (e) {
        throw e;
    }

    return noteDoc;

};

module.exports = generateNoteCheckAndSave;
