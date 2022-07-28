import { Decoder } from "../auth";
import { ErrorCode, UsersEnums } from "../constant";
import { useHistory } from "react-router-dom";
import { BASE_URL, PROD } from "../apiConfig/config";
import axios from "axios";
import { ApiCall } from "../middleware";
import moment from "moment";


export function AuthCheck() {
    var navigate = useHistory();
    if (localStorage.getItem("AuthToken")) {
        let token = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(token);
        // console.log("CommonFunction AuthUser:", authUser)
        if (authUser.data.userType === UsersEnums.APPLICATION_ROLE.ADMIN) {
            navigate.push("/home")
        }
    }
}

export function getLocalStorageData() {
    if (localStorage.getItem("AuthToken")) {
        let token = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(token);
        // console.log("CommonFunction AuthUser:", authUser);
        return authUser;
    }
}

export function consoleLog(str, val) {
    let con = "";
    if (str === undefined || str === null || str === "") {
        con = "Console>>>"
    } else {
        con = str
    }

    if (!PROD) {
        return console.log(con + ">>>", val)
    }
}

export async function imageUpload(image) {
    axios.post(BASE_URL + "v1/imageupload", image).then((res) => {
        if (res.data.success === true && res.data.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.data.response);
            consoleLog("Image Payload::", payload);
            return payload.data;
        }
    });
}

export async function getLandingDataFromAPI() {
    let res = await ApiCall("getLandingData");
    if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        let payload = Decoder.decode(res.response);
        // consoleLog("All Look up data Payload::", payload.data);
        return payload.data;
    }
}

export function kbConverter(byte) {
    let kb = (byte / 1024).toFixed(2);
    return kb;
}

export function SetTimeMinSecFormat(value) {
    let hh = moment(value).format("HH");
    let mn = moment(value).format("mm");
    let ss = moment(value).format("ss");
    let time = hh + ":" + mn + ":" + ss;
    return time;
};

export function SetScheduleDate(value) {
    let day = moment(value).format("DD");
    let Month = moment(value).format("MM");
    let Year = moment(value).format("YYYY");
    let finalDate = Month + "-" + day + "-" + Year;
    return finalDate;
};

export function SetDOBDate(value) {
    let day = moment(value).format("DD");
    let Month = moment(value).format("MM");
    let Year = moment(value).format("YYYY");
    let finalDate = Year + "-" + Month + "-" + day;
    return finalDate;
};

export function SetDateFormat(value){
  let day = moment(value).format("DD");
  let Month = moment(value).format("MM");
  let Year = moment(value).format("YYYY");
  let time = moment(value).format("LT");

  let finalDate = Month + "-" + day + "-" + Year + " | " + time;
  return finalDate;
};
