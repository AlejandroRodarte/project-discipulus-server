const generateSaveAndAddStudents = ({ parent, child, validate = () => Promise.resolve() }) => async function() {

    const doc = this;

    const ParentModel = doc.model(parent.modelName);
    const ChildModel = doc.model(child.modelName);

    const parentDoc = await ParentModel.findOne({ _id: doc[parent.ref] });

    if (!parentDoc) {
        throw new Error(parent.notFoundErrorMessage);
    }

    try {
        await validate(parentDoc);
        await doc.save();
    } catch (e) {
        throw e;
    }

    try {

        const childIds = await parentDoc[parent.getIdsMethodName]();

        const childModelDocs = childIds.map(childId => ({
            [child.doc.ref1]: doc._id,
            [child.doc.ref2]: childId
        }));

        const childDocs = await ChildModel.insertMany(childModelDocs);

        return [doc, childDocs];

    } catch (e) {
        return [doc, undefined];
    }

};

module.exports = generateSaveAndAddStudents;
