const generateSimpleCheckAndSave = validate => async function() {

    const doc = this;

    try {
        await validate(doc);
        await doc.save();
    } catch (e) {
        throw e;
    }

    return doc;

};

module.exports = generateSimpleCheckAndSave;
