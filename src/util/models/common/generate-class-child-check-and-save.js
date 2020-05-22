const generateClassChildCheckAndSave = ({ local, foreign, validate }) => async function() {

    const doc = this;

    const LocalModel = doc.model(local.modelName);
    const ForeignModel = doc.model(foreign.modelName);

    const foreignDoc = await ForeignModel.findOne({
        _id: doc[foreign.ref]
    });

    if (!foreignDoc) {
        throw new Error(foreign.notFoundErrorMessage);
    }

    const localDoc = await LocalModel.findOne({
        _id: doc[local.ref]
    });

    if (!localDoc) {
        throw new Error(local.notFoundErrorMessage);
    }

    try {
        await validate(localDoc, foreignDoc, doc);
        await doc.save();
    } catch (e) {
        throw e;
    }

    return doc;

};

module.exports = generateClassChildCheckAndSave;
