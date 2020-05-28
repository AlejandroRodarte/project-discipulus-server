const generalJointExistsValidator = ({ left, right }) => async function(doc) {

    const LeftModel = doc.model(left.modelName);
    const RightModel = doc.model(right.modelName);

    const leftModelExists = await LeftModel.exists({
        _id: doc[left.ref],
        ...left.extraCond
    });

    if (!leftModelExists) {
        throw new Error(left.errorMessage);
    }

    const rightModelExists = await RightModel.exists({
        _id: doc[right.ref],
        ...right.extraCond
    });

    if (!rightModelExists) {
        throw new Error(right.errorMessage);
    }

};

module.exports = generalJointExistsValidator;
