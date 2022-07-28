import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL, IMAGE_URL } from "../../../../services/apiConfig/config";
import { Decoder } from "../../../../services/auth";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData, kbConverter } from "../../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { Validate } from "../../../../services/Validator";
import { emailLengthValidator, emailValidator, mobileValidator, nameValidator, passwordValidator } from "../../../../services/Validator/Validator";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";

function AddUser() {
    let navigate = useHistory();
    const [userId, setUserId] = useState("");
    const [allRole, setAllRole] = useState([]);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imagePath, setImagePath] = useState("");

    useEffect(async () => {
        let authUser = getLocalStorageData();
        setUserId(authUser.data.userId);
        let data = await getLandingDataFromAPI();
        getAllRoles(data);
    }, []);

    function getAllRoles(data) {
        let arr = [];
        if (Object.keys(data).length > 0) {
            if (data.userType) {
                if (data.userType.length > 0) {
                    data.userType.map((item) => {
                        arr.push({
                            id: item.id,
                            type: item.lookupValue
                        })
                    });
                    setAllRole(arr);
                }
            }
        }
    }

    function changeName(e) {
        document.getElementById("nameDiv").classList.remove("eror");
        if (nameValidator(e.target.value)) {
            setName(e.target.value);
        }
    }

    function changeMobile(e) {
        document.getElementById("mobileDiv").classList.remove("eror");
        if (mobileValidator(e.target.value)) {
            setMobile(e.target.value)
        }
    }

    function changeRole(e) {
        setRole(e.target.value)
    }

    function changeEmail(e) {
        document.getElementById("emailDiv").classList.remove("eror");
        setEmail(e.target.value);
    }

    function changePassword(e) {
        document.getElementById("passwordDiv").classList.remove("eror");
        setPassword(e.target.value);
    }

    function changeConfirmPassword(e) {
        document.getElementById("confirmPassDiv").classList.remove("eror");
        setConfirmPassword(e.target.value);
    }

    async function uploadImage(e) {
        const formData = new FormData();
        // consoleLog("Image details::", kbConverter(e.target.files[0].size));
        if (kbConverter(e.target.files[0].size) < 500.00) {
            formData.append("file", e.target.files[0]);
            axios.post(BASE_URL + "v1/imageupload", formData).then((res) => {
                if (res.data.success === true && res.data.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    let payload = Decoder.decode(res.data.response);
                    setImagePath(payload.data.fileName)
                }
            });
        } else {
            toast.error(AlertMessage.MESSAGE.IMAGE.IMAGE_GREATER);
        }
    }

    async function onSubmit() {
        let errorCounter = 0;
        if (name === "") {
            document.getElementById("nameDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.NAME.EMPTY_NAME);
            errorCounter++;
        } else if (mobile === "") {
            document.getElementById("mobileDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY);
            errorCounter++;
        } else if (mobile.length < 10) {
            document.getElementById("mobileDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_LESS);
            errorCounter++;
        } else if (mobile.length > 14) {
            document.getElementById("mobileDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_GREATER);
            errorCounter++;
        } else if (role === "") {
            toast.error(AlertMessage.MESSAGE.ROLE.ROLE_EMPTY);
            errorCounter++;
        } else if (email !== "" && !emailValidator(email)) {
            document.getElementById("emailDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_INVALID);
            errorCounter++;
        } else if (email !== "" && !emailLengthValidator(email)) {
            document.getElementById("emailDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_GREATER);
            errorCounter++;
        } else if (password === "") {
            document.getElementById("passwordDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY);
            errorCounter++;
        } else if (!passwordValidator(password)) {
            document.getElementById("passwordDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_VALID);
            errorCounter++;
        } else if (confirmPassword === "") {
            document.getElementById("confirmPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_EMPTY);
            errorCounter++;
        } else if (!passwordValidator(confirmPassword)) {
            document.getElementById("confirmPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.CONF_PASSWORD.CONF_PASSWORD_NOT_VALID);
            errorCounter++;
        } else if (password !== confirmPassword) {
            document.getElementById("confirmPassDiv").classList.add("eror");
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH);
            errorCounter++;
        } else if (imagePath === "") {
            toast.error(AlertMessage.MESSAGE.USER.IMAGE_EMPTY);
        }

        if (errorCounter == 0) {
            let obj = {
                createdBy: userId,
                fullName: name,
                email: email,
                countryCode: "91",
                mobile: mobile,
                profilePicture: imagePath,
                password: password,
                userTypeId: role
            }
            let res = await ApiCall("createUser", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                navigate.push("/allusers");
            } else if (res.success === false) {
                if (res.status === ErrorCode.ERROR.ERROR_CODE.MOBILE_EXIST) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXSIST);
                } else if (res.status === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST) {
                    toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXSIST);
                }
            }
        }
    }

    function goBack() {
        navigate.push("/allusers");
    }

    const reset = () => {
        setName("");
        setMobile("");
        setRole("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setImagePath("");
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

                        <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goBack()}></i>
                        <strong>
                            <span>Dashboard</span>Add New User</strong>
                    </div>

                </div>
                <div className="_fl dashboard-list">
                    <div className="row">
                        <div className="col-md-12">
                            <h4>User Details</h4>
                            <div className="_fl prof-list-bx ppedit addnew_us pr1">

                                <div className="edit_file">
                                    <div className="edit_file_in">
                                        <div className="ed_nm flunm" id="nameDiv">
                                            <label>Full Name</label>
                                            <input type="text" name="fname" value={name} placeholder="Enter Full name" onChange={changeName} />
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm mob_nm" id="mobileDiv">
                                            <label>Mobile Number</label>
                                            <input type="text" name="mobile" value={mobile} placeholder="Enter Mobile Number" onChange={changeMobile} />
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm role">
                                            <label>Role</label>
                                            <select onChange={changeRole}>
                                                <option value=""></option>
                                                {allRole.length > 0 ? <>
                                                    {allRole.map((data, i) => <React.Fragment key={i}>
                                                        <option key={i} value={data.id}>{data.type}</option>
                                                    </React.Fragment>)}
                                                </> : <></>}
                                            </select>
                                        </div>
                                        <div className="ed_nm emlid" id="emailDiv">
                                            <label>Email ID</label>
                                            <input type="text" value={email} placeholder="Enter Email" name="email" onChange={changeEmail} />
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm passw" id="passwordDiv">
                                            <label>Password</label>
                                            <input type="password" value={password} name="password" placeholder="" onChange={changePassword} />
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            <p>* Minimum 6 characters<br />* At least one small alphabet<br />* At least one
                                                number<br />* At least one special characters</p>
                                        </div>
                                        <div className="ed_nm passw" id="confirmPassDiv">
                                            <label>Confirm Password</label>
                                            <input type="password" value={confirmPassword} name="confirmPass" placeholder="" onChange={changeConfirmPassword} />
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            {/* <p>password is not matched</p> */}
                                        </div>
                                        <div className="btn_dv">
                                            <button className="btn btn-grn" onClick={() => onSubmit()}>
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                Add User
                                            </button>
                                            <button className="btn btn-whi" onClick={() => reset()}>
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="drag_img">
                                    <img className="prof_img" src={imagePath === "" ? "assets/images/cmr.png" : IMAGE_URL + imagePath} />
                                    <label htmlFor="userImg">Drag N Drop or Choose image</label>
                                    <input type="file" id="userImg" accept="image/png, image/jpg, image/jpeg" style={{ display: "none" }} onChange={uploadImage} />
                                    <p>max allowed image size 500 kb<br /> Please use only jpg/jpeg/png</p>
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

export default AddUser;