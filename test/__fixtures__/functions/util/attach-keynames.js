const { v4 } = require('uuid');

const uuidv4 = v4;

const attachKeynames = (key, arr) => {

    return arr.map(item => {

        const [, ...extensions] = item[key].originalname.split('.');
        const keyname = `${uuidv4()}.${extensions.join('.')}`;

        return {
            ...item,
            [key]: {
                ...item[key],
                keyname
            }
        };

    });


};

module.exports = attachKeynames;
