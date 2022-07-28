import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Decoder } from "../../services/auth";
import { consoleLog } from "../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode, UsersEnums } from "../../services/constant";
import { ApiCall } from "../../services/middleware";
import { mobileValidator, otpValidator, passwordValidator } from "../../services/Validator/Validator";

export default function ForgetPassword() {
    let navigate = useHistory();

    useEffect(() => {
        if (localStorage.getItem("AuthToken")) {
            let token = localStorage.getItem("AuthToken");
            let authUser = Decoder.decode(token);
            if (authUser.data.userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN) {
                navigate.push("/home")
            }
        }
    })



    const [mobile, setMobile] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isNewPassword, setIsNewPassword] = useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = useState(true);
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerify, setIsOtpVerify] = useState(false);
    const [userId, setUserId] = useState("");


    function changeMobile(e) {
        if (mobileValidator(e.target.value)) {
            setMobile(e.target.value)
        }
    }

    function viewNewPassword() {
        if (isNewPassword) {
            setIsNewPassword(false);
        } else {
            setIsNewPassword(true)
        }
    }

    function viewConfirmPassword() {
        if (isConfirmPassword) {
            setIsConfirmPassword(false);
        } else {
            setIsConfirmPassword(true)
        }
    }

    async function sentOtp() {
        let errorCounter = 0;
        if (mobile === "") {
            toast.error(AlertMessage.MESSAGE.LOGIN.EMPTY_ID)
            errorCounter++;
        } else if (mobile.length < 10) {
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_LESS);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                mobile: mobile,
                countryCode: "91"
            }

            let res = await ApiCall("forgetPassword", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                setIsOtpSent(true);
            } else if (res.success === false) {
                if (res.status === ErrorCode.ERROR.ERROR_CODE.MOBILE_NOT_REGISTERED) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_NOT_MATCH)
                } else {
                    toast.error("Internal Server error");
                }
            }
        }
    }

    function changeOtp(e) {
        if (otpValidator(e.target.value)) {
            setOtp(e.target.value);
        }
    }

    function changeNewPassword(e) {
        setNewPassword(e.target.value)
    }

    function changeConfirmPassword(e) {
        setConfirmPassword(e.target.value)
    }

    async function verifyOtp() {
        let errorCounter = 0;
        if (otp === "") {
            toast.error(AlertMessage.MESSAGE.OTP.EMPTY_OTP);
            errorCounter++;
        }
        if (errorCounter == 0) {
            let obj = {
                mobile: mobile,
                countryCode: "91",
                otp: otp
            }

            let res = await ApiCall("verifyOTP", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let payload = Decoder.decode(res.response);
                if (payload.data.userId !== undefined) {
                    setUserId(payload.data.userId)
                }
                setIsOtpVerify(true);
            } else if (res.success === false) {
                if (res.status == 400) {
                    toast.error(AlertMessage.MESSAGE.OTP.OTP_EXPIRE)
                } else if (res.status == 1008) {
                    toast.error(AlertMessage.MESSAGE.OTP.WRONG_OTP)
                }
            }
        }
    }



    async function resetPassword() {
        let errorCounter = 0;
        if (newPassword === "") {
            toast.error(AlertMessage.MESSAGE.NEW_PASSWORD.PASSWORD_EMPTY);
            errorCounter++;
        } else if (!passwordValidator(newPassword)) {
            toast.error(AlertMessage.MESSAGE.NEW_PASSWORD.PASSWORD_NOT_VALID);
            errorCounter++;
        } else if (confirmPassword === "") {
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_EMPTY);
            errorCounter++;
        } else if (newPassword !== confirmPassword) {
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH);
            errorCounter++;
        } else if (!passwordValidator(confirmPassword)) {
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_NOT_VALID);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                userId: userId,
                password: newPassword
            }

            let res = await ApiCall("resetPassword", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                navigate.push("/login");
            } else if (res.success === false) {
                if (res.status == 500) {
                    toast.error(AlertMessage.MESSAGE.INTERNAL_SERVER_ERROR)
                } else if (res.status == 1001) {
                    toast.error("Parameter Missing")
                }
            }
        }
    }

    function goToLogin() {
        navigate.push("/login");
    }
    return (
        <>
            <ToastContainer hideProgressBar theme="colored" />
            <div className="bg-form logn_pge_dv">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="man_pge_con logn_pge">
                                <img src="assets/images/amazon-logo.png" />
                                <h2>Amazon Trucking & <br />Distribution</h2>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                            </div>
                        </div>


                        <div className="col-lg-6">
                            <div className="login-application">

                                <div className="login-account-wrap _fl" hidden={!isOtpVerify && !isOtpSent ? false : true}>
                                    <h2>Forget Password</h2>
                                    <h3>Continue To Amazon Trucking System</h3>
                                    <div className="form-row-ab ">
                                        <i className="icne">
                                            <img src="assets/images/user-icn.png" />
                                        </i>
                                        <input type="text" value={mobile} name="mobile" placeholder="Mobile" className="in-field" onChange={changeMobile} />
                                    </div>
                                    <div className="form-row-ab form-sbt logn_btn"><button className="btn btn-primary lob_btn" onClick={() => sentOtp()}>Sent OTP</button></div>
                                </div>

                                <div className="login-account-wrap _fl" hidden={!isOtpVerify && isOtpSent ? false : true}>
                                    <h2>Forget Password</h2>
                                    <h3>Continue To Amazon Trucking System</h3>
                                    <div className="form-row-ab ">
                                        <i className="icne">
                                            <img src="assets/images/user-icn.png" />
                                        </i>
                                        <input type="text" value={otp} name="otp" placeholder="OTP" className="in-field" onChange={changeOtp} />
                                    </div>
                                    <div className="form-row-ab form-sbt logn_btn"><button className="btn btn-primary lob_btn" onClick={() => verifyOtp()}>Verify OTP</button></div>
                                </div>



                                <div className="login-account-wrap _fl" hidden={isOtpVerify && isOtpSent ? false : true}>
                                    <h2>Forget Password</h2>
                                    <h3>Continue To Amazon Trucking System</h3>
                                    {/* <form> */}
                                    <div className="form-row-ab">
                                        <i className="icne">
                                            <img src="assets/images/passwo-icn.png" />
                                        </i>
                                        <input type={isNewPassword ? "password" : "text"} value={newPassword} name="newpassword" placeholder="New Password" className="in-field" onChange={changeNewPassword} />
                                        <button className="vew-pass" onClick={() => viewNewPassword()}>
                                            <img className={isNewPassword ? "see " : "see icnes"} src="assets/images/vew-pass-icn.png" />
                                            <img className={isNewPassword ? "see icnes" : "see "} src="assets/images/cnt-vew-pass-icn.png" />
                                        </button>
                                    </div>
                                    <div className="form-row-ab">
                                        <i className="icne">
                                            <img src="assets/images/passwo-icn.png" />
                                        </i>
                                        <input type={isConfirmPassword ? "password" : "text"} value={confirmPassword} name="confpassword" placeholder="Confirm New Password" className="in-field" onChange={changeConfirmPassword} />
                                        <button className="vew-pass" onClick={() => viewConfirmPassword()}>
                                            <img className={isConfirmPassword ? "see " : "see icnes"} src="assets/images/vew-pass-icn.png" />
                                            <img className={isConfirmPassword ? "see icnes" : "see "} src="assets/images/cnt-vew-pass-icn.png" />
                                        </button>
                                    </div>
                                    <div className="form-row-ab form-sbt logn_btn"><button className="btn btn-primary lob_btn" onClick={() => resetPassword()}>Submit</button></div>
                                    <div className="col-md-12 forgt_pass"><a href="javascript:void(0)" className="forgot-pass-link"><strong onClick={() => goToLogin()}>Login</strong></a></div>
                                    {/* </form> */}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}