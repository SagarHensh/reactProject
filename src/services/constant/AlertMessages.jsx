export const MESSAGE = Object.freeze({
    MOBILE: {
        MOBILE_EMPTY: "Please enter your mobile no !",
        MOBILE_LESS: "Mobile no is less than 10 Digits !",
        MOBILE_GREATER: "Mobile no cannot exceed 14 digits !",
        MOBILE_ZERO_CHECK: "Mobile no cannot start with 0 !",
        MOBILE_NOT_MATCH: "Mobile number not exist !",
        MOBILE_VALID: "Mobile number must be a minimum 10 and maximum 14 characters !",
        MOBILE_EXSIST: "Mobile no already exsists !",
        MOBILE_NOT_EXIST : "Mobile number not exist",
    },
    PASSWORD: {
        PASSWORD_EMPTY: "Please enter your password !",
        PASSWORD_NOT_VALID: "Password must contains Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        PASSWORD_WRONG: "You have enter a wrong password",
        PASSWORD_NOT_MATCH: "Password not matching !",
        UPDATE_SUCCESS: "Password updated successfully",
    },
    CONF_PASSWORD: {
        CONF_PASSWORD_EMPTY: "Please enter confirm password !",
        CONF_PASSWORD_NOT_VALID: "Confirm Password must contains Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        CONF_PASSWORD_WRONG: "You have enter a wrong password",
        CONF_PASSWORD_NOT_MATCH: "Password not matching !"
    },
    CURRENT_PASSWORD: {
        PASSWORD_EMPTY: "Please enter your current password !",
        PASSWORD_NOT_VALID: "Password must contains Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        PASSWORD_WRONG: "You have enter a wrong password",
    },
    NEW_PASSWORD: {
        PASSWORD_EMPTY: "Please enter your new password !",
        PASSWORD_NOT_VALID: "New Password must contains Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        PASSWORD_WRONG: "You have enter a wrong password",
        PASSWORD_NOT_MATCH: "Password not matching !"
    },
    EMAIL: {
        EMAIL_EMPTY: "Please enter your email !",
        EMAIL_INVALID: "Please enter valid email id !",
        EMAIL_NOT_MATCH: "Email not matching !",
        EMAIL_NOT_EXIST: "Your email does not exist !",
        EMAIL_SEND_TO_YOU: "Reset link sent to your email",
        RESET_LINK: "We sent a reset link to your email",
        EMAIL_EXSIST: "Email already exsists !",
        EMAIL_GREATER: "Email cannot exceed 50 character",
    },
    USER: {
        UNAUTHORIZE_USER: "Unauthorized user !",
        NOT_VALID: "You are not a valid user !",
        ACTIVATED: "User is Activated",
        DEACTIVATED: "User is Deactivated",
        DELETED: "User deleted successfully",
        UPDATE_SUCCESS: "User updated successfully",
        IMAGE_EMPTY: "User image cannot be empty",
    },
    FIRST_NAME: {
        EMPTY_NAME: "First name can not be empty !",
        VALID_NAME: "Please enter a valid first name !",
        LENGTH_NAME: "First name can be in between 100 character !"
    },
    LAST_NAME: {
        EMPTY_NAME: "Last name can not be empty !",
        VALID_NAME: "Please enter a valid last name !",
        LENGTH_NAME: "Last name can be in between 100 character !"
    },
    USER_TYPE: {
        EMPTY_USER_TYPE: "Please select type !"
    },
    ROLE: {
        OTHER_ROLE_EMPTY: "Please enter your other role !",
        ROLE_EMPTY: "Please select role !"
    },
    ADD: {
        SUCCESS: "Successfully added",
        ERROR: "Error occure while adding"
    },
    UPDATE: {
        SUCCESS: "Successfully updated",
        ERROR: "Error occure while update"
    },
    LOGIN: {
        EMPTY_ID: "Please enter your login id"
    },
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    OTP: {
        EMPTY_OTP: "Please Enter OTP",
        OTP_EXPIRE: "OTP expired !",
        OTP_NOT_VALID: "OTP not valid",
        WRONG_OTP: "Wrong OTP"
    },
    NAME: {
        EMPTY_NAME: "Please enter name",
        INVALID_NAME: "Please enter a valid name",
        NAME_EXCEED: "Name cannot be exceed 100 characters",
    },
    IMAGE: {
        IMAGE_GREATER: "Image cannot be greater than 500 KB",

    },
    CARRIER: {
        APPROVE: "Carrier approved successfully",
        REJECT: "Carrier request rejected successfully",
        ACTIVATE: "Carrier activated successfully",
        DEACTIVATE: "Carrier Deactivated successfully",
        NOT_FOUND : "No Carrier Found",
    },
    VEHICLE: {
        EMPTY_VEHICLE_ID: "Please enter vehicle id",
        EMPTY_NUMBER_PLATE: "Please enter vehicle number plate",
        EMPTY_VIN: "Please enter Vin Number",
        EMPTY_VEHICLE_TYPE: "Please select vehicle type",
        EMPTY_MAKE: "Please select make Data",
        EMPTY_MODEL: "Please select the model",
        EMPTY_YEAR: "Please select year",
        EMPTY_EXPIRE_DATE: "Please enter expire date",
        EMPTY_OWNER: "Please select vehicle owner",
        EMPTY_STATUS: "Please select the vehicle status",
        EMPTY_KM: "Please enter starting Kilometer",
        EMPTY_IMAGE: "Please select one Image",
        EMPTY_DOC: "Please select one Document",
        ADD_SUCCESS: "Vehicle Added Successfully",
        UPDATE_SUCCESS: "Vehicle update successfully",
        DELETE_SUCCESS: "Vehicle deleted successfully",
    }

})