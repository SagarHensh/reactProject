import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IMAGE_URL } from "../../services/apiConfig/config";
import { Decoder } from "../../services/auth";
import { consoleLog, getLocalStorageData } from "../../services/commonFunction/commonFunction";
import { ErrorCode } from "../../services/constant";
import { ApiCall } from "../../services/middleware";

function AdminHeader() {
    let navigate = useHistory();

    const [userId, setUserId] = useState("");
    const [userTypeId, setUserTypeId] = useState("");
    const [userName, setUserName] = useState("");
    const [imagePath, setImagePath] = useState("");

    useEffect(() => {
        onViewApi();
    }, []);

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
                setUserName(respObj.userName);
                setImagePath(respObj.profilePicture);
            }
        }
    }

    function logout() {
        localStorage.removeItem("AuthToken");
        navigate.push("/login");
    }

    function viewProfile() {
        navigate.push("/myProfile");
    }
    return (
        <>
            <div className="to_prt">
                <button className="_menubtn"><img src="assets/images/Menu.png" /></button>
                <div className="app-right-info">
                    <div className="notification">
                        <a href="#"><img src="assets/images/bell.png" /> <span>1</span></a>
                        <span>Notifications</span>
                    </div>
                    <div className="setting_dv"><i className="fa fa-sliders" aria-hidden="true"></i><span>Settings</span>
                    </div>
                    <div className="profile-pic">
                        <h4><strong>Welcome</strong> {userName}</h4>
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={imagePath === "" ? "assets/images/profile-pic.png" : IMAGE_URL + imagePath} /><i class="fa fa-sort-desc" aria-hidden="true"></i></a>
                        <div className="prof_div dropdown-menu" aria-labelledby="dropdownMenuLink2">
                            <ul>
                                <li><a className="dropdown-item" href="javascript:void(0)" onClick={() => viewProfile()}>Edit Profile</a></li>
                                <li><a className="dropdown-item" href="javascript:void(0)" onClick={() => logout()}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHeader;