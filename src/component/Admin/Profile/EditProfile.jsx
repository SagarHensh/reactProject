import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL, IMAGE_URL } from "../../../services/apiConfig/config";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLocalStorageData, imageUpload, kbConverter } from "../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import { nameValidator, mobileValidator, emailValidator } from "../../../services/Validator/Validator";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";

function EditProfile() {
    let navigate = useHistory();
    useEffect(() => {
        onViewApi()
    }, []);

    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [mobile, setMobile] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [imagePath, setImagePath] = useState("");

    async function onViewApi() {
        let authUser = getLocalStorageData();
        let obj = {
            userId: authUser.data.userId
        }
        // consoleLog("View Profilel req::", obj)
        let res = await ApiCall("profileDetails", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("ViewProfilePayload::", payload.data);
            if (payload.data.length > 0) {
                let respObj = payload.data[0];
                setUserId(authUser.data.userId);
                setFullName(respObj.userName);
                setRole(authUser.data.userType);
                setEmail(respObj.email);
                setMobile(respObj.phone);
                setCountryCode(respObj.countryCode);
                setImagePath(respObj.profilePicture);
            }
        }
    }

    async function uploadImage(e) {
        const formData = new FormData();
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

    function changeName(e) {
        if (nameValidator(e.target.value)) {
            setFullName(e.target.value);
        }
    }
    function changePhone(e) {
        if (mobileValidator(e.target.value)) {
            setMobile(e.target.value);
        }
    }
    function changeEmail(e) {
        setEmail(e.target.value);
    }

    async function updateProfile() {
        let errorCounter = 0;
        if (!emailValidator(email)) {
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_INVALID);
            errorCounter++;
        } else if (mobile.length < 10) {
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_LESS);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                userId: userId,
                fullName: fullName,
                email: email,
                countryCode: countryCode,
                mobile: mobile,
                profilePicture: imagePath
            }
            let res = await ApiCall("profileUpdate", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                navigate.push("/myProfile");
            }
        }
    }

    function reset() {
        onViewApi();
    }

    function goToMyAccount() {
        navigate.push("/myProfile")
    }


    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
            {/* <div className="wrapper">
                <Sidebar />
                <Header /> */}

            <div className="component-wrapper">


                <div className="page-head-section">
                    <div className="hd_bk">

                        <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goToMyAccount()}></i>
                        <strong>
                            <span>Dashboard</span>Edit Details</strong>
                    </div>

                </div>
                <div className="_fl dashboard-list">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="_fl prof-list-bx ppedit pr1">
                                <div className="edit_file">
                                    <div className="edit_file_in">
                                        <div className="ed_nm flunm"><label>Full Name</label><input type="text" value={fullName} placeholder="Full Name" onChange={changeName} /></div>
                                        <div className="ed_nm emlid"><label>Email ID</label><input type="text" value={email} placeholder="Email" onChange={changeEmail} /></div>
                                        {/* <div className="ed_nm usrnm"><label>User Name</label><input type="text" value="" placeholder="johndeo2022" /></div> */}
                                        <div className="ed_nm role"><label>Role</label><input type="text" value={role} placeholder="Role" readOnly /></div>
                                        <div className="ed_nm mob_nm"><label>Mobile Number</label><input type="text" value={mobile} placeholder="Mobile" onChange={changePhone} /></div>

                                    </div>
                                    <div className="btn_dv">
                                        <button className="btn btn-grn" onClick={() => updateProfile()}>Update</button>
                                        <button className="btn btn-whi" onClick={() => reset()}>Reset</button>

                                    </div>
                                </div>
                                <div className="drag_img" htmlFor="profileImg">
                                    <img className="prof_img" src={imagePath === "" ? "assets/images/cmr.png" : IMAGE_URL + imagePath} />
                                    <label htmlFor="profileImg" >Drag N Drop or Choose image</label>
                                    <p>max allowed image size 500 kb<br /> Please use only jpg/jpeg/png</p>
                                </div>
                                <input type="file" id="profileImg" accept="image/png, image/jpg, image/jpeg" style={{ display: "none" }} onChange={(e) => uploadImage(e)} />
                            </div>
                        </div>



                    </div>
                </div>

            </div>
            {/* </div> */}
        </>
    )
}

export default EditProfile;