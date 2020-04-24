const XRegExp = require('xregexp');

module.exports = {
    roleName: /^ROLE_([A-Z]*|[A-Z]*_)*(?<!_)$/,
    singleName: XRegExp('^\\p{L}+$'),
    fullName: XRegExp('^[\\p{L} \'\\u2019]+$'),
    username: /^(?![_.\d])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    mimeType: /^\w+\/[-+.\w]+$/,
    filename: /^[\sA-Za-z0-9_-]*(\.[A-Za-z0-9]{1,})+$/,
    trimCornerSpaces: /^\s+|\s+$/g,
    reduceMiddleSpaces: /\s+/g,
    strongPassword: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
};
