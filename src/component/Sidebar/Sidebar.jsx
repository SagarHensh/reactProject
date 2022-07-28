import React, { useEffect, useState } from "react";
import { getLocalStorageData } from "../../services/commonFunction/commonFunction";
import { UsersEnums } from "../../services/constant";
import AdminSidebar from "./AdminSidebar";
import DispatcherSidebar from "./DispatcherSidebar";


function Sidebar() {
    const [userType, setUserType] = useState("");
    useEffect(() => {
        let authUser = getLocalStorageData();
        setUserType(authUser.data.userTypeId)
    }, []);
    return (<>
        {userType === UsersEnums.APPLICATION_ROLE.ADMIN ?
            <AdminSidebar /> :
            <DispatcherSidebar />
        }
    </>)
}

export default Sidebar;