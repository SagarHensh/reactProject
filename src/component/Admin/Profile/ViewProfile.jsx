import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IMAGE_URL } from "../../../services/apiConfig/config";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLocalStorageData } from "../../../services/commonFunction/commonFunction";
import { ErrorCode, UsersEnums } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";

function ViewProfile() {
    let navigate = useHistory();
    useEffect(() => {
        onViewApi()
    })
    const [userId, setUserId] = useState("");
    const [userTypeId, setUserTypeId] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [imagePath, setImagePath] = useState("");

    async function onViewApi() {
        let authUser = getLocalStorageData();
        setUserTypeId(authUser.data.userTypeId);
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
                setName(respObj.userName);
                setType(authUser.data.userType);
                setUserName(respObj.userName);
                setUserEmail(respObj.email);
                setUserPhone("+" + respObj.countryCode + " " + respObj.phone);
                setImagePath(respObj.profilePicture);
            }
        }
    }

    function onEditProfile() {
        navigate.push("/editProfile");
    }

    function goTochangePassword() {
        navigate.push("/changePassword");
    }

    function goToDashboard() {
        if (userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN) {
            navigate.push("/home");
        } else {
            navigate.push("/dispatcherDashboard");
        }
    }
    return (
        <>
            {/* <div className="wrapper">
                <Sidebar />
                <Header /> */}
            <div className="component-wrapper">
                <div className="page-head-section">
                    <div className="hd_bk">

                        <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goToDashboard()}></i>
                        <strong>
                            <span>Dashboard</span>My Account</strong>
                    </div>
                </div>
                <div className="_fl dashboard-list">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="_fl prof-list-bx pr1">
                                <div className="profile_dv">
                                    <div className="ppicdv"><img src={imagePath === "" ? "assets/images/cmr.png" : IMAGE_URL + imagePath} className="view_prof_img" /></div>
                                    <div className="pp_dtl">
                                        <strong>{name}</strong>
                                        <span>{type}</span>
                                        <div className="jjde">
                                            <div className="jjde_dv">
                                                <label>User Name</label>
                                                {userName}
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Email ID</label>
                                                {userEmail}
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Phone Number</label>
                                                {userPhone}
                                            </div>
                                        </div>
                                        <div className="btn_dv">
                                            <button className="btn edt_btn" onClick={() => onEditProfile()}><i className="fa fa-pencil" aria-hidden="true"></i>
                                                Edit Profile</button>
                                            <button className="btn chg_psw_btn" onClick={() => goTochangePassword()}><i className="fa fa-key" aria-hidden="true"></i>
                                                Change Password</button>

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

export default ViewProfile;