const XRegExp = require('xregexp');

module.exports = {
    roleName: /^ROLE_([A-Z]*|[A-Z]*_)*(?<!_)$/,
    singleName: XRegExp('^\\p{L}+$'),
    fullName: XRegExp('^(Sr\\.\\s|Mr\\.\\s|Ms\\.\\s|Dr\\.\\s|Mrs\\.\\s)*[\\p{L} \'\\u2019]+(Sr\\.|Mr\\.|Ms\\.|Dr\\.|Mrs\\.|Jr\\.)*$'),
    username: /^(?![_.\d])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    mimeType: /^(\w|-)+\/[-+.\w]+$/,
    filename: /^([\s'&\\.A-Za-z0-9_-]|\(.+\))*(\.[A-Za-z0-9_]{1,})+$/,
    trimCornerSpaces: /^\s+|\s+$/g,
    reduceMiddleSpaces: /\s+/g,
    strongPassword: /^((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    fileKeyname: /^([0-9a-f]{24})(\.[A-Za-z0-9_]{1,})+$/,
    imageMimetype: /^image\/(gif|jpe?g|png|bmp)$/,
    imageExtension: /^(.+)(\.)(gif|jpe?g|png|bmp)$/
};
