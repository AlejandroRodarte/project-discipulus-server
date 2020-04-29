const { Types } = require('mongoose');

const generateOneToMany = (parentKeyName, parentId, children) => {

    return children.map(child => ({
        _id: new Types.ObjectId(),
        [parentKeyName]: parentId,
        ...child
    }));

};

module.exports = generateOneToMany;
