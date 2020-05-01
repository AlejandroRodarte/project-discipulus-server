const getFileExtensions = (arr, key) => {

    return arr.map(item => {
        const [, ...extensions] = item[key].originalname.split('.');
        return `${item._id.toHexString()}.${extensions.join('.')}`;
    });

};

module.exports = getFileExtensions;
