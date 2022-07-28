import { consoleLog } from "../commonFunction/commonFunction";
import { Regex } from "../constant";

// input empty validate
export function inputEntryValidate(text, type) {
    let newText = "";
    // for name input field
    if (type === "name") {
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(Regex.NAME_REGEX)) {
                newText = newText + text[i];
            }
        }
    } else if (type === "nameSpace") {    // for name with space input field
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(Regex.NAME_SPACE_REGEX)) {
                newText = newText + text[i];
            }
        }
    } else if (type === "mobile") {       // for mobile number from input field
        for (var i = 0; i < text.length; i++) {
            if (Regex.NUMBER_REGEX.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
        }
    } else if (type === "address") {     // for address from input field
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(Regex.ADDRESS_REGEX)) {
                newText = newText + text[i];
            }
        }
    } else if (type === "city") {     // for city from input field
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(Regex.ADDRESS_REGEX)) {
                newText = newText + text[i];
            }
        }
    } else if (type === "zip") {     // for Zip from input field
        for (var i = 0; i < text.length; i++) {
            if (Regex.NUMBER_REGEX.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
        }
    } else if (type === "note") {     // for address from input field
        for (var i = 0; i < text.length; i++) {
            if (text[i].match(Regex.ADDRESS_REGEX)) {
                newText = newText + text[i];
            }
        }
    } else if (type === "email") {
        newText = text.toLowerCase();
    } else {
        newText = text;
    }
    return newText;
};

export function nameValidator(text) {
    if (text === "") {
        return true;
    } else {
        if (text.match(Regex.NAME_REGEX)) {
            return true;
        } else {
            return false;
        }
    }
    // consoleLog("Name Validation::", text.match(Regex.NAME_REGEX));
}

export function mobileValidator(num) {
    if (num === "") {
        return true;
    } else {
        if (num.match(Regex.MOBILE_REGEX)) {
            return true;
        } else {
            return false;
        }
    }
}

export function emailValidator(text) {

    if (text.match(Regex.EMAIL_REGEX)) {
        return true;
    } else {
        return false;
    }
}

export function passwordValidator(text) {

    if (text.match(Regex.PASS_REGEX)) {
        return true;
    } else {
        return false;
    }
}

export function otpValidator(num) {
    if (num === "") {
        return true;
    } else {
        if (num.match(Regex.OTP_REGEX)) {
            return true;
        } else {
            return false;
        }
    }
}

export function emailLengthValidator(text) {
    if (text.length > 0 && text.length < 50) {
        return true;
    } else {
        return false;
    }
} 

// input field for empty
export function inputEmptyValidate(text) {
    if (
      text === undefined ||
      text === null ||
      text.length === 0 ||
      text === [] ||
      text === {} ||
      text === "" 
    ) {
      return false;
    } else {
      return true;
    }
  };