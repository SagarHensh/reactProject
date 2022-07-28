import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Decoder } from "../../services/auth";
import { consoleLog } from "../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode, UsersEnums } from "../../services/constant";
import { ApiCall } from "../../services/middleware";
import { passwordValidator } from "../../services/Validator/Validator";

export default function Login() {
    let navigate = useHistory();

    useEffect(() => {
        if (localStorage.getItem("AuthToken")) {
            let token = localStorage.getItem("AuthToken");
            let authUser = Decoder.decode(token);
            if (authUser.data.userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN) {
                navigate.push("/home")
            }
        } else {
            if (localStorage.getItem("RememberDetails")) {
                let details = localStorage.getItem("RememberDetails");
                consoleLog("RememberDetails::", details)
            }
        }
    })



    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [isPassword, setIsPassword] = useState(true);
    const [isRemember, setIsRemember] = useState(true);


    function changeMobile(e) {
        setMobile(e.target.value)
    }

    function changePassword(e) {
        setPassword(e.target.value);
    }

    function viewPassword() {
        if (isPassword) {
            setIsPassword(false);
        } else {
            setIsPassword(true)
        }
    }

    async function onLogin() {
        let errorCounter = 0;
        if (mobile === "") {
            toast.error(AlertMessage.MESSAGE.LOGIN.EMPTY_ID)
        } else if (mobile.length < 10) {
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_LESS);
            errorCounter++;
        } else if (password === "") {
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY);
            errorCounter++;
        } else if (!passwordValidator(password)) {
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_VALID);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                mobile: mobile,
                password: password
            }

            let res = await ApiCall("signin", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

                localStorage.setItem("AuthToken", res.response);
                let authUser = Decoder.decode(res.response);
                if (authUser.data.userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN) {
                    navigate.push("/home")
                } else if (authUser.data.userTypeId === UsersEnums.APPLICATION_ROLE.DISPATCHER) {
                    navigate.push("/dispatcherDashboard");
                } else {
                    toast.error("Invalid credentials");
                }
            } else if (res.success === false) {
                if (res.status === ErrorCode.ERROR.ERROR_CODE.INCORRECT_PASSWORD) {
                    toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_WRONG);
                } else if (res.status === ErrorCode.ERROR.ERROR_CODE.MOBILE_NOT_REGISTERED) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_NOT_EXIST);
                } else if (res.status === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR) {
                    toast.error(AlertMessage.MESSAGE.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }
    function goForgetPassword() {
        navigate.push("/forgetPassword");
    }

    function rememberMe() {
        if (isRemember) {
            localStorage.removeItem("RememberDetails");
            setIsRemember(false);
        } else {
            let obj = {
                id: mobile,
                password: password
            }
            localStorage.setItem("RememberDetails", obj);
            setIsRemember(true);
        }
    }
    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
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

                                <div className="login-account-wrap _fl">
                                    <h2>Log In</h2>
                                    <h3>Continue To Amazon Trucking System</h3>
                                    {/* <form> */}
                                    <div className="form-row-ab ">
                                        <i className="icne">
                                            <img src="assets/images/user-icn.png" />
                                        </i>
                                        <input type="text" value={mobile} name="mobile" placeholder="Mobile" className="in-field" onChange={changeMobile} />
                                    </div>
                                    <div className="form-row-ab">
                                        <i className="icne">
                                            <img src="assets/images/passwo-icn.png" />
                                        </i>
                                        <input type={isPassword ? "password" : "text"} value={password} name="password" placeholder="Password" className="in-field" onChange={changePassword} />
                                        <button className="vew-pass" onClick={() => viewPassword()}>
                                            <img className={isPassword ? "see " : "see icnes"} src="assets/images/vew-pass-icn.png" />
                                            <img className={isPassword ? "see icnes" : "see "} src="assets/images/cnt-vew-pass-icn.png" />
                                        </button>
                                    </div>
                                    <div className="form-row-ab">
                                        <div className="row">
                                            <div className="col-6 col-md-6">
                                                <label className="custom_check">Remember Me
                                                    <input type="checkbox" defaultChecked={isRemember} onChange={rememberMe} />
                                                    <span className="checkmark"></span>
                                                </label>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="form-row-ab form-sbt logn_btn"><button className="btn btn-primary lob_btn" onClick={() => onLogin()}>login</button></div>
                                    <div className="col-md-12 forgt_pass"><a href="javascript:void(0)" className="forgot-pass-link"><strong onClick={() => goForgetPassword()}>Forgot Password?</strong></a></div>
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