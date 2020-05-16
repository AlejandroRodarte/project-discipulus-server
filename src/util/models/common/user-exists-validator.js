const { user } = require('../../../db/names');
const { modelErrorMessages } = require('../../errors');

const userExistsValidator = async (doc) => {

    const User = doc.model(user.modelName);

    const { user: userId } = doc;

    const userExists = await User.exists({ 
        _id: userId,
        enabled: true
    });

    if (!userExists) {
        throw new Error(modelErrorMessages.userNotFoundOrDisabled);
    }

};

module.exports = userExistsValidator;
