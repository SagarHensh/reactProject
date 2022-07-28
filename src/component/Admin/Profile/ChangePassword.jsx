import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { consoleLog, getLocalStorageData } from "../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import { passwordValidator } from "../../../services/Validator/Validator";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";

export default function ChangePassword() {
    let navigate = useHistory();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [isCurrPass, setIsCurrPass] = useState(true);
    // const [isNewPassword, setIsNewPassword] = useState(true);
    // const [isConfirmPassword, setIsConfirmPassword] = useState(true);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        let authUser = getLocalStorageData();
        setUserId(authUser.data.userId);
    }, []);

    function changeCurrentPassword(e) {
        document.getElementById("currPassDiv").classList.remove("eror");
        setCurrentPassword(e.target.value);
    }

    function changeNewPassword(e) {
        document.getElementById("newPassDiv").classList.remove("eror");
        setNewPassword(e.target.value);
    }

    function changeConfirmPassword(e) {
        document.getElementById("confPassDiv").classList.remove("eror");
        setConfirmPassword(e.target.value);
    }

    async function onChangePassword() {
        let errorCounter = 0;
        if (currentPassword === "") {
            document.getElementById("currPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.CURRENT_PASSWORD.PASSWORD_EMPTY);
            errorCounter++;
        } else if (newPassword === "") {
            document.getElementById("newPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.NEW_PASSWORD.PASSWORD_EMPTY);
            errorCounter++;
        } else if (!passwordValidator(newPassword)) {
            document.getElementById("newPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.NEW_PASSWORD.PASSWORD_NOT_VALID);
            errorCounter++;
        } else if (confirmPassword === "") {
            document.getElementById("confPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_EMPTY);
            errorCounter++;
        } else if (newPassword !== confirmPassword) {
            document.getElementById("confPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH);
            errorCounter++;
        } else if (!passwordValidator(confirmPassword)) {
            document.getElementById("confPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_NOT_VALID);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                userId: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            }
            let res = await ApiCall("changePassword", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                navigate.push("/myProfile");
            } else if (res.success === false) {
                if (res.status === ErrorCode.ERROR.ERROR_CODE.CURRENT_PASSWORD_NOT_MATCHED) {
                    toast.error(AlertMessage.MESSAGE.CURRENT_PASSWORD.PASSWORD_WRONG)
                    document.getElementById("currPassDiv").classList.add("eror");
                }
            }
        }
    }

    function onReset() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        document.getElementById("currPassDiv").classList.remove("eror");
        document.getElementById("newPassDiv").classList.remove("eror");
        document.getElementById("confPassDiv").classList.remove("eror");
    }

    function goToMyAccount() {
        navigate.push("/myProfile")
    }
    return (
        <>
            <ToastContainer hideProgressBar position="top-center" theme="colored" />
            {/* <div className="wrapper">
                <Sidebar />
                <Header /> */}
                <div className="component-wrapper">
                    <div className="page-head-section">
                        <div className="hd_bk">

                            <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goToMyAccount()}></i>
                            <strong>
                                <span>My Account</span>Change Password</strong>
                        </div>

                    </div>
                    <div className="_fl dashboard-list">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="_fl prof-list-bx ppedit addnew_us pr1">

                                    <div className="pass_chnge">
                                        <div className="edit_file_in">

                                            <div className="ed_nm emlid" id="currPassDiv">
                                                <label>Current Password</label>
                                                <input type="password" name="currPass" value={currentPassword} placeholder="" onChange={changeCurrentPassword} />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            </div>
                                            <div className="ed_nm passw" id="newPassDiv">
                                                <label>New Password</label>
                                                <input type="password" name="newPass" value={newPassword} placeholder="" onChange={changeNewPassword} />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                                <p>* Minimum 6 characters<br />* At least one small alphabet<br />* At least one
                                                    number<br />* At least one special characters</p>
                                            </div>
                                            <div className="ed_nm passw" id="confPassDiv">
                                                <label>Confirm New Password</label>
                                                <input type="password" name="confPass" value={confirmPassword} placeholder="" onChange={changeConfirmPassword} />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                                {/* <p>password is not matched</p> */}
                                            </div>
                                            <div className="btn_dv">
                                                <button className="btn btn-grn" onClick={() => onChangePassword()}>Update</button>
                                                <button className="btn btn-whi" onClick={() => onReset()}>Reset</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </>
    )
}