module.exports.NAME_REGEX = /^[a-zA-Z 0-9]+$/; // /^[ A-Za-z0-9_@./#&+-]*$/
module.exports.NAME_SPACE_REGEX = /^[a-zA-Z0-9 \s]+$/;
module.exports.NUMBER_REGEX = '0123456789';
module.exports.AMOUNT_REGEX = '0123456789.';
// module.exports.PASS_REGEX                   =           /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
module.exports.PASS_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{6,})$/;
module.exports.ADDRESS_REGEX = /^[_@/#&+-.?!,;:() A-Za-z0-9]*$/;
module.exports.MOBILE_REGEX = /^[0-9]{1,10}$/;
module.exports.EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.OTP_REGEX = /^[0-9]{1,4}$/;