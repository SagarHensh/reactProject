import { useEffect, useState } from "react";
import { getLocalStorageData } from "../../services/commonFunction/commonFunction";
import { UsersEnums } from "../../services/constant";
import AdminHeader from "./AdminHeader";
import DispatcherHeader from "./DispatcherHeader";

function Header() {
    const [userType, setUserType] = useState("");
    useEffect(() => {
        let authUser = getLocalStorageData();
        setUserType(authUser.data.userTypeId)
    }, []);
    return (
        <>
            {userType === UsersEnums.APPLICATION_ROLE.ADMIN ?
                <AdminHeader /> :
                <DispatcherHeader />
            }
        </>
    )
}

export default Header;