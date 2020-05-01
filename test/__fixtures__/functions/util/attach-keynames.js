const attachKeynames = (arr) => {

    return arr.map(item => {

        const [, ...extensions] = item.originalname.split('.');

        const newItem = {
            ...item,
            keyname: `${item._id.toHexString()}.${extensions.join('.')}`
        };

        delete newItem._id;

        return newItem;

    });

};

module.exports = attachKeynames;
