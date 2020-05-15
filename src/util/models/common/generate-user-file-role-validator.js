const { user } = require('../../../db/names');

const { modelErrorMessages } = require('../../errors');

const generateUserFileRoleValidator = (role) => async (fileDoc) => {
        
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

module.exports = generateUserFileRoleValidator;
