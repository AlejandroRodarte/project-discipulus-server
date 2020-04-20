module.exports = {
    roleName: /^ROLE_/,
    singleName: /^\p{L}+$/,
    fullName: /^(?:[\p{L}\p{Mn}\p{Pd}\'\x{2019}]+\s[\p{L}\p{Mn}\p{Pd}\'\x{2019}]+\s?)+$/,
    username: /^(?![_.\d])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
};
