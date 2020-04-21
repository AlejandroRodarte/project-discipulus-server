const XRegExp = require('xregexp');

module.exports = {
    roleName: /^ROLE_/,
    singleName: XRegExp('^\\p{L}+$'),
    fullName: XRegExp('^[\\p{L} \'.-]+$'),
    username: /^(?![_.\d])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    mimeType: /^\w+\/[-+.\w]+$/,
    filename: /^[A-Za-z0-9_-]*\.*[A-Za-z0-9]{1,}$/
};
