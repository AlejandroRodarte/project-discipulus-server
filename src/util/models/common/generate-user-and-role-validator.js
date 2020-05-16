const { user } = require('../../../db/names');

const { modelErrorMessages } = require('../../errors');

const generateUserAndRoleValidator = (role) => async (fileDoc) => {
        
    const User = fileDoc.model(user.modelName);
    const { user: userId } = fileDoc;

    try {
        await User.findByIdAndValidateRole(userId, role, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });
    } catch (e) {
        throw e;
    }

};

module.exports = generateUserAndRoleValidator;
