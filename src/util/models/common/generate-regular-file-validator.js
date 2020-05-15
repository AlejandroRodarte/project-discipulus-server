const generateRegularFileValidator = ({ parentModelName, ref, notFoundErrorMessage }) => async (fileDoc) => {
        
    const ParentModel = fileDoc.model(parentModelName);

    const parentDocExists = await ParentModel.findOne({
        _id: fileDoc[ref]
    });

    if (!parentDocExists) {
        throw new Error(notFoundErrorMessage);
    }

};

module.exports = generateRegularFileValidator;
