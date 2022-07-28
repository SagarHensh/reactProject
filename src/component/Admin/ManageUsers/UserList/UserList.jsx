import React, { useEffect, useState } from "react";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import { useHistory } from "react-router-dom";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData, kbConverter, SetScheduleDate } from "../../../../services/commonFunction/commonFunction";
import { ApiCall } from "../../../../services/middleware";
import { AlertMessage, ErrorCode } from "../../../../services/constant";
import { Decoder } from "../../../../services/auth";

import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import { emailLengthValidator, emailValidator, nameValidator, passwordValidator } from "../../../../services/Validator/Validator";
import { BASE_URL, IMAGE_URL } from "../../../../services/apiConfig/config";
import axios from "axios";
import { APIURL } from "../../../../services/apiConfig/admin";

function UserList() {
    let navigate = useHistory();
    useEffect(async () => {
        let data = await getLandingDataFromAPI();
        getAllRoles(data);
    }, []);
    const [listData, setListData] = useState([]);
    const [totalRecords, setTotalRecords] = useState("");
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [currPage, setCurrPage] = useState("1");
    const [totalPage, setTotalPage] = useState("1");
    const [showDeactivateModal, setDeactivateModal] = useState(false);
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userCountryCode, setUserCountryCode] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userStatus, setUserStatus] = useState("");
    const [userCreation, setUserCreation] = useState("");
    const [viewUserId, setViewUserId] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [userId, setUserId] = useState("");
    const [allRole, setAllRole] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [allPageNumber, setAllPageNumber] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState({
        column: "",
        type: ""
    });

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

    function goAdd() {
        navigate.push("/addUser");
    }

    function openDeactivateModal() {
        window.$('#deactivateModal').modal('show');
    }

    function closeDeactivateModal() {
        window.$('#deactivateModal').modal('hide');
    }

    function openEditModal() {
        window.$('#editUserModal').modal('show');
    }

    function closeEditModal() {
        window.$('#editUserModal').modal('hide');
    }

    function openPasswordModal(id) {
        closeViewModal();
        setViewUserId(id)
        window.$('#resetPasswordModal').modal('show');
    }

    function closePasswordModal() {
        window.$('#resetPasswordModal').modal('hide');
    }

    useEffect(() => {
        getListData();
    }, [limit, currPage]);

    async function getListData() {
        let authUser = getLocalStorageData();
        let obj = {
            userId: authUser.data.userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText,
            sort: sort
        }
        setUserId(authUser.data.userId);
        let res = await ApiCall("userListData", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("user List::", payload.data);
            setTotalRecords(payload.data.tatalRecords);
            let totalPage = Math.ceil(payload.data.tatalRecords / limit);
            setListData(payload.data.data);
            setTotalPage(totalPage);
            let arr = [];
            for (let i = 1; i <= totalPage; i++) {
                arr.push(i);
            }
            setAllPageNumber(arr);
            closeViewModal();
        } else if (res.success === false) {
            if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
                setListData([]);
            }
        }
    }

    const searchTextChange = (e) => {
        setSearchText(e.target.value)
    }

    function searchClick() {
        getListData()
    }

    const statusChange = (e, uid) => {

        if (!e.target.checked) {
            openDeactivateModal();
            setViewUserId(uid);
        } else {
            activateUser(uid)
        }
    }

    function viewUser(id) {
        setViewUserId(id);
        let obj = {
            userId: id
        }
        viewUserData(obj);
    }

    async function viewUserData(obj) {
        // consoleLog("View Profilel req::", obj)
        let res = await ApiCall("viewUser", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("User Details::", payload.data);
            if (Object.keys(payload.data).length > 0) {
                let respObj = payload.data;
                setUserName(respObj.userName);
                setUserType(respObj.userRole);
                setUserEmail(respObj.email);
                setUserPhone(respObj.phone);
                setUserCountryCode(respObj.countryCode);
                setUserCreation(SetScheduleDate(respObj.createDate))
                setUserStatus(respObj.status);
                if (respObj.profilePicture !== undefined || respObj.profilePicture !== null) {
                    setImagePath(respObj.profilePicture);
                }
                window.$('#exampleModal').modal('show');
            }
        }
    }

    function closeViewModal() {
        window.$('#exampleModal').modal('hide');
    }

    function activateUser(uid) {
        let obj = {
            userId: uid,
            status: "1",
            modifiedBy: userId
        }
        statusChangeAPI(obj);
    }

    function deactivateUser(uid) {
        let obj = {
            userId: uid,
            status: "0",
            modifiedBy: userId
        }
        statusChangeAPI(obj);
        closeDeactivateModal();
    }

    async function statusChangeAPI(data) {
        let res = await ApiCall("userStatusChange", data);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            getListData();
            if (data.status === "1") {
                toast.success(AlertMessage.MESSAGE.USER.ACTIVATED)
            } else if (data.status === "0") {
                toast.success(AlertMessage.MESSAGE.USER.DEACTIVATED)
            } else {
                toast.success(AlertMessage.MESSAGE.USER.DELETED)
            }
        }

    }

    async function showEditUser(id) {
        closeViewModal();
        setViewUserId(id);
        let obj = {
            userId: id
        }
        getUserDetails(obj)
        openEditModal();
    }

    function resetUserData() {
        let obj = {
            userId: viewUserId
        }
        getUserDetails(obj)
    }

    async function getUserDetails(obj) {
        let res = await ApiCall("viewUser", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("User Details::", payload.data);
            if (Object.keys(payload.data).length > 0) {
                let respObj = payload.data;
                setUserName(respObj.userName);
                setUserType(respObj.userTypeId);
                setUserEmail(respObj.email);
                setUserPhone(respObj.phone);
                setUserCountryCode(respObj.countryCode);
                setUserCreation(SetScheduleDate(respObj.createDate))
                setUserStatus(respObj.status);
                if (respObj.profilePicture !== undefined || respObj.profilePicture !== null) {
                    setImagePath(respObj.profilePicture);
                }
            }
        }
    }

    function changeName(e) {
        if (nameValidator(e.target.value)) {
            setUserName(e.target.value);
        }
    }

    function changeRole(e) {
        setUserType(e.target.value)
    }

    function changeEmail(e) {
        setUserEmail(e.target.value);
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

    async function updateUser() {
        let errorCounter = 0;
        if (userName === "") {
            toast.error(AlertMessage.MESSAGE.NAME.EMPTY_NAME);
            errorCounter++;
        } else if (userName.length > 100) {
            toast.error(AlertMessage.MESSAGE.NAME.NAME_EXCEED);
            errorCounter++;
        } else if (userType === "") {
            toast.error(AlertMessage.MESSAGE.ROLE.ROLE_EMPTY);
            errorCounter++;
        } else if (!emailValidator(userEmail)) {
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_INVALID);
            errorCounter++;
        } else if (!emailLengthValidator(userEmail)) {
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_GREATER);
            errorCounter++;
        }

        if (errorCounter == 0) {
            let obj = {
                modifiedBy: userId,
                userId: viewUserId,
                fullName: userName,
                email: userEmail,
                countryCode: userCountryCode,
                mobile: userPhone,
                profilePicture: imagePath,
                password: "",
                userTypeId: userType
            }
            let res = await ApiCall("userUpdate", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                // navigate.push("/myProfile");
                getListData();
                closeEditModal();
                toast.success(AlertMessage.MESSAGE.USER.UPDATE_SUCCESS);
            } else if (res.success === false) {
                if (res.status === ErrorCode.ERROR.ERROR_CODE.MOBILE_EXIST) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXSIST);
                } else if (res.status === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST) {
                    toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXSIST);
                }
            }
        }
    }

    function changeNewPassword(e) {
        document.getElementById("newPassDiv").classList.remove("eror");
        setNewPassword(e.target.value);
    }

    function changeConfirmPassword(e) {
        document.getElementById("confPassDiv").classList.remove("eror");
        setConfirmPassword(e.target.value);
    }

    async function resetPasswordApi() {
        let errorCounter = 0;
        if (newPassword === "") {
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
                userId: viewUserId,
                password: newPassword,
                modifiedBy: userId
            }
            let res = await ApiCall("userPasswordUpdate", obj);
            if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                closePasswordModal();
                toast.success(AlertMessage.MESSAGE.PASSWORD.UPDATE_SUCCESS);
            } else {
                toast.error("Error occured !!!");
            }
        }


    }

    async function exportList() {
        let obj = {
            userId: userId
        }
        let res = await ApiCall("userListExport", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            window.open(IMAGE_URL + payload.data.response.fileName)
            toast.success("Download successfullly");
        } else {
            toast.error("Error occured !!!");
        }

    }

    function changePagination(e) {
        setLimit(e.target.value);
    }

    function changePage(page) {
        setCurrPage(page);
    }

    function nextPage() {
        if (currPage < totalPage) {
            setCurrPage(Number(currPage) + 1);
        }
    }

    function previousPage() {
        if (currPage > 1) {
            setCurrPage(Number(currPage) - 1);
        }
    }

    async function orderByDesc(data) {
        let filter = "";
        if (data === "userName") {
            filter = "userName"
        } else if (data === "userRole") {
            filter = "userRole"
        } else if (data === "email") {
            filter = "email"
        } else if (data === "phone") {
            filter = "phone"
        } else if (data === "createDate") {
            filter = "createDate"
        } else if (data === "status") {
            filter = "status"
        }
        setSort({
            column: filter,
            type: "DESC"
        })
        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText,
            sort: sort
        }
        let res = await ApiCall("userListData", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("user List::", payload.data);
            setTotalRecords(payload.data.tatalRecords);
            let totalPage = Math.ceil(payload.data.tatalRecords / limit);
            setListData(payload.data.data);
            setTotalPage(totalPage);
            let arr = [];
            for (let i = 1; i <= totalPage; i++) {
                arr.push(i);
            }
            setAllPageNumber(arr);
            closeViewModal();
        } else if (res.success === false) {
            if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
                setListData([]);
            }
        }
    }

    async function orderByAsc(data) {
        let filter = "";
        if (data === "userName") {
            filter = "userName"
        } else if (data === "userRole") {
            filter = "userRole"
        } else if (data === "email") {
            filter = "email"
        } else if (data === "phone") {
            filter = "phone"
        } else if (data === "createDate") {
            filter = "createDate"
        } else if (data === "status") {
            filter = "status"
        }
        setSort({
            column: filter,
            type: "ASC"
        })
        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText,
            sort: sort
        }
        let res = await ApiCall("userListData", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("user List::", payload.data);
            setTotalRecords(payload.data.tatalRecords);
            let totalPage = Math.ceil(payload.data.tatalRecords / limit);
            setListData(payload.data.data);
            setTotalPage(totalPage);
            let arr = [];
            for (let i = 1; i <= totalPage; i++) {
                arr.push(i);
            }
            setAllPageNumber(arr);
            closeViewModal();
        } else if (res.success === false) {
            if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
                setListData([]);
            }
        }
    }

    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
            {/* <div className="wrapper">
                <Sidebar />
                <Header /> */}
            <div className="component-wrapper">
                <div className="page-head-section no_bor">
                    <h1 className="text-uppercase">Manage Users</h1>
                    <div className="btn_dv exp_ad">
                        <button className="btn edt_btn" onClick={() => exportList()}><i className="fa fa-upload" aria-hidden="true"></i>Export</button>
                        <button className="btn chg_psw_btn" onClick={() => goAdd()}><i className="fa fa-plus-circle" aria-hidden="true"></i>add
                            User</button>

                    </div>
                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">
                        <div className="vn-form _fl">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="vn_frm">
                                        <h2>List of Users</h2>

                                    </div>
                                </div>
                                <div className="col-md-8">
                                    {/* <div className="vn_frm rt">
                                        <input type="text" value={searchText} name="search_user" placeholder="Search" className="inputfield" onChange={searchTextChange} />
                                    </div> */}
                                    <div className="filt srce" style={{ float: "right" }}>
                                        <input type="text" placeholder="Search" value={searchText} onChange={searchTextChange} autoComplete="nope" />
                                        <button className="btn fil-src_btn" onClick={() => searchClick()}><i className="fa fa-search" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>





                        <div className="table-listing-app">
                            <div className="table-responsive">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <th style={{ width: "8%" }}>Full Name
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("userName")} hidden={sort.column === "userName" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("userName")} hidden={sort.column === "userName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "7%" }}>Role
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("userRole")} hidden={sort.column === "userRole" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("userRole")} hidden={sort.column === "userRole" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "12%" }}>Email
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("email")} hidden={sort.column === "email" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("email")} hidden={sort.column === "email" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "12%" }}>Mobile No
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("phone")} hidden={sort.column === "phone" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("phone")} hidden={sort.column === "phone" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "10%" }}>Date of Creation
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("createDate")} hidden={sort.column === "createDate" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("createDate")} hidden={sort.column === "createDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "10%" }}>Status
                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("status")} hidden={sort.column === "status" && sort.type === "ASC"}><img
                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                    className="t1" onClick={() => orderByDesc("status")} hidden={sort.column === "status" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                        </th>
                                        <th style={{ width: "6%" }}>Action</th>
                                    </tr>
                                    {listData.length > 0 ? <>
                                        {listData.map((data, i) =>
                                            <React.Fragment key={i}>
                                                {/* {consoleLog("HTML DATA::", data)} */}
                                                <tr>
                                                    <td style={{ width: "8%" }}>{data.userName}</td>
                                                    <td style={{ width: "7%" }}>{data.userRole}</td>
                                                    <td style={{ width: "12%" }}>{data.email}</td>
                                                    <td style={{ width: "12%" }}>{"+" + data.countryCode} {data.phone}</td>
                                                    <td style={{ width: "10%" }}>{SetScheduleDate(data.createDate)}</td>
                                                    <td style={{ width: "10%" }}>
                                                        <div className="switch-plan-data">
                                                            <div className="switch-toggle">

                                                                <label className="switch">
                                                                    {data.status == 0 ?
                                                                        <input id="xxxsx" type="checkbox" checked={false} name="xxxsx" onChange={(e) => statusChange(e, data.userId)} /> :
                                                                        <input id="xxxsx" type="checkbox" checked={true} name="xxxsx" onChange={(e) => statusChange(e, data.userId)} />
                                                                    }
                                                                    {/* <input id="xxxsx" type="checkbox" defaultChecked={data.status == 0 ? false : true} name="xxxsx" onChange={(e) => statusChange(e, data.userId)} /> */}
                                                                    <span className="slider round"></span> </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ width: "6%" }}>

                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>

                                                            <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink2">

                                                                <ul>
                                                                    <li>
                                                                        <a href="javascript:void(0)"
                                                                            //  data-toggle="modal"
                                                                            // data-target="#exampleModal" 
                                                                            onClick={() => viewUser(data.userId)}>
                                                                            User Details
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="javascript:void(0)" onClick={() => showEditUser(data.userId)}>Edit User</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="javascript:void(0)" onClick={() => openPasswordModal(data.userId)}>Reset Password</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>)}
                                    </> : <>
                                        <tr>
                                            <td colSpan="7">No Data Found</td>
                                        </tr>
                                    </>}
                                </table>
                            </div>
                            <div className="peg_blo">
                                <div className="dataTables_info" id="dtBasicExample_info" role="status" aria-live="polite">
                                    Showing <b>{(currPage - 1) * limit + 1}</b> to <b>{Number((currPage - 1) * limit) + listData.length}</b> of <b>{totalRecords}</b> entries</div>

                                <div className="dataTables_paginate paging_simple_numbers" id="dtBasicExample_paginate">
                                    <ul className="pagination">
                                        {allPageNumber.length > 0 ? <>
                                            {allPageNumber.map((page, p) => <React.Fragment key={p}>
                                                <li className="paginate_button page-item " id={"pg_" + p + 1} onClick={() => changePage(p + 1)}>
                                                    <a href="javascript:void(0)" aria-controls="dtBasicExample" data-dt-idx="1" tabindex="0" className="page-link">{page}</a>
                                                </li>
                                                {/* <li className="paginate_button page-item active"><a href="#"
                                                        aria-controls="dtBasicExample" data-dt-idx="2" tabindex="0"
                                                        className="page-link">2</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="3" tabindex="0" className="page-link">3</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="4" tabindex="0" className="page-link">4</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="5" tabindex="0" className="page-link">5</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="6" tabindex="0" className="page-link">6</a></li> */}
                                            </React.Fragment>)}
                                        </> : <></>}

                                    </ul>
                                </div>
                                <div className="dataTables_length bs-select" id="dtBasicExample_length"><label>Show <select
                                    name="dtBasicExample_length" aria-controls="dtBasicExample"
                                    className="custom-select custom-select-sm form-control form-control-sm" value={limit} onChange={changePagination}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select> rows</label></div>
                                <div className="pag_btn">
                                    <button className="paginate_button page-item previous" id="dtBasicExample_previous" onClick={() => previousPage()}><a
                                        href="javascript:void(0)" aria-controls="dtBasicExample" data-dt-idx="0" tabindex="0"
                                        className="page-link"><img src="assets/images/left-arrow.png" /></a></button>
                                    <button className="paginate_button page-item next" id="dtBasicExample_next" onClick={() => nextPage()}><a href="javascript:void(0)"
                                        aria-controls="dtBasicExample" data-dt-idx="7" tabindex="0"
                                        className="page-link"><img src="assets/images/right-arrow.png" /></a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
            {/* <!-- Modal user details--> */}
            <div className="modal fade bd-example-modal-md" id="exampleModal" role="dialog">
                <div className="modal-dialog modal-md usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-id-card-o"
                                aria-hidden="true"></i>
                                User Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="usr_dtl_sc">
                                <div className="profile_dv">
                                    <div className="ppicdv">
                                        <img className="view_prof_img" src={IMAGE_URL + imagePath}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = "assets/images/cmr.png";
                                            }} />
                                    </div>
                                    <div className="pp_dtl">
                                        <strong>{userName}</strong>
                                        <span>{userType}</span>
                                        <div className="jjde">
                                            <div className="jjde_dv">
                                                <label>User Role</label>
                                                <input type="text" value={userType} readOnly />
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Phone Number</label>
                                                <input type="text" value={"+" + userCountryCode + " " + userPhone} readOnly />
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Email Id</label>
                                                <input type="text" value={userEmail} readOnly />
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Status</label>
                                                <input type="text" value={userStatus == 0 ? "Deactive" : "Active"} readOnly />
                                            </div>
                                            <div className="jjde_dv">
                                                <label>Date of Creation</label>
                                                <input type="text" value={userCreation} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn_dv">
                                        {userStatus == 0 ? <button className="btn reset_btn" onClick={() => activateUser(viewUserId)}>Activate </button> :
                                            <button className="btn deac_btn" onClick={() => deactivateUser(viewUserId)}>Deactivate</button>
                                        }
                                        <button className="btn reset_btn" onClick={() => openPasswordModal(viewUserId)}>Reset Password </button>
                                        <button className="btn edt_psw_btn" onClick={() => showEditUser(viewUserId)}>Edit</button>

                                    </div>

                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- Modal edit userdetails--> */}
            <div className="modal fade bd-example-modal-lg" id="editUserModal" role="dialog">
                <div className="modal-dialog modal-lg usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-pencil" aria-hidden="true"></i>
                                Edit User Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="close" onClick={() => closeEditModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className=" ppedit pr1">
                                <div className="usr_ed_pop">
                                    <div className="edit_file addnew_us">
                                        <div className="edit_file_in">
                                            <div className="ed_nm flunm">
                                                <label>Full Name</label>
                                                <input type="text" value={userName} placeholder="" onChange={changeName} />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            </div>
                                            <div className="ed_nm mob_nm">
                                                <label>Mobile Number</label>
                                                <input type="text" value={userPhone} placeholder="" readOnly />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            </div>
                                            <div className="ed_nm role">
                                                <label>Role</label>
                                                <select onChange={changeRole} value={userType}>
                                                    <option value=""></option>
                                                    {allRole.length > 0 ? <>
                                                        {allRole.map((data, i) => <React.Fragment key={i}>
                                                            <option key={i} value={data.id}>{data.type}</option>
                                                        </React.Fragment>)}
                                                    </> : <></>}
                                                </select>
                                            </div>
                                            <div className="ed_nm emlid">
                                                <label>Email ID</label>
                                                <input type="text" value={userEmail} placeholder="" onChange={changeEmail} />
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="drag_img">
                                        <img className="prof_img" src={imagePath === "" ? "assets/images/cmr.png" : IMAGE_URL + imagePath}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = "assets/images/cmr.png";
                                            }}
                                        />
                                        < label htmlFor="userImg" > Drag N Drop or Choose image</label>
                                        <input type="file" id="userImg" style={{ display: "none" }} onChange={uploadImage} />

                                        <p>max allowed image size 500 kb<br /> Please use only jpg/jpeg/png</p>
                                    </div>


                                    <div className="btn_dv">
                                        <button className="btn btn-grn" onClick={() => updateUser()}>Submit</button>
                                        <button className="btn btn-whi" onClick={() => resetUserData()}>Reset</button>
                                        {/* <p><strong><i className="fa fa-check" aria-hidden="true"></i> Success!</strong>Data has
                                            been updated</p> */}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- Modal reset password--> */}
            <div className="modal fade" id="resetPasswordModal" role="dialog">
                <div className="modal-dialog usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-key" aria-hidden="true"></i>Reset
                                Password</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="edit_file_in addnew_us res_pss">
                                <div className="ed_nm flunm" id="newPassDiv">
                                    <label>Password</label>
                                    <input type="password" value={newPassword} onChange={changeNewPassword} />
                                    <i className="fa fa-check" aria-hidden="true"></i><i
                                        className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                    <p>* Minimum 6 characters<br />* At least one small alphabet<br />* At least one number<br />*
                                        At least one special characters</p>
                                </div>
                                <div className="ed_nm mob_nm" id="confPassDiv">
                                    <label>Confirm Password</label>
                                    <input type="password" value={confirmPassword} onChange={changeConfirmPassword} />
                                    <i className="fa fa-check" aria-hidden="true"></i><i
                                        className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                    {/* <p>password matched</p> */}
                                </div>
                            </div>
                            <div className="btn_dv reser_pass">
                                <button className="btn btn-grn" onClick={() => resetPasswordApi()}>Submit</button>
                                <button className="btn btn-whi" onClick={() => closePasswordModal()}>Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- Modal sure activate--> */}
            <div className="modal fade" id="deactivateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel4"
                aria-hidden="true">
                <div className="modal-dialog usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="sure_act">
                                <strong>Are you sure?</strong>
                                <p>Do you really want to deactivate this user?</p>
                                <p>you can always change the user status anytime</p>

                            </div>
                            <div className="btn_dv de_act">
                                <button className="btn btn-red" onClick={() => deactivateUser(viewUserId)}>Deactivate</button>
                                <button className="btn btn-whi" onClick={() => closeDeactivateModal()}>Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default UserList;