const generateSaveAndAddStudents = ({ parent, child }) => async function() {

    const doc = this;

    const ParentModel = doc.model(parent.modelName);
    const ChildModel = doc.model(child.modelName);

    const parentModel = await ParentModel.findOne({ _id: doc[parent.ref] });

    if (!parentModel) {
        throw new Error(parent.notFoundErrorMessage);
    }

    try {
        await doc.save();
    } catch (e) {
        throw e;
    }

    try {

        const childIds = await parentModel[parent.getIdsMethodName]();

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
