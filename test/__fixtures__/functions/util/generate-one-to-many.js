const { Types } = require('mongoose');

const generateOneToMany = (keys, parentId, childIds) => {

    const [parentKeyName, childKeyName] = keys;

    return childIds.map(childId => ({
        _id: new Types.ObjectId(),
        [parentKeyName]: parentId,
        [childKeyName]: childId
    }));

};

module.exports = generateOneToMany;
