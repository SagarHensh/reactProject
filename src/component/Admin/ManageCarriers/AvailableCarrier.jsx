import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL } from "../../../services/apiConfig/config";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData, SetScheduleDate } from "../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode, UsersEnums } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";

export default function AvailableCarrier() {
    const [userTypeId, setUserTypeId] = useState("");
    const [listType, setListType] = useState("1");  // 0 -> New request, 1-> Approve request, 2 -> rejected request, all-> all data 
    const [limit, setLimit] = useState("10");
    const [currPage, setCurrPage] = useState("1");
    const [totalPage, setTotalPage] = useState("1");
    const [listData, setListData] = useState([]);
    const [userId, setUserId] = useState("");
    const [landingData, setAllLandingData] = useState([]);
    const [allPageNumber, setAllPageNumber] = useState([]);
    const [allOrderType, setAllOrderType] = useState([]);
    const [allCarrierType, setAllCarrierType] = useState([]);
    const [carrierType, setCarrierType] = useState("");
    const [totalRecords, setTotalRecords] = useState("");
    const [viewUserId, setViewUserId] = useState("");
    const [viewCarrierStatus, setViewCarrierStatus] = useState("");

    const [viewCarrierDetails, setViewCarrierDetails] = useState({});
    const [reason, setReason] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState({
        column: "",
        type: ""
    });


    useEffect(async () => {
        let authUser = getLocalStorageData();
        setUserId(authUser.data.userId);
        setUserTypeId(authUser.data.userTypeId);
        let data = await getLandingDataFromAPI();
        setAllLandingData(data);
        if (data.carrierType.length > 0) {
            setAllCarrierType(data.carrierType);
        }
        getListdata(authUser.data.userId);
    }, []);

    function getListdata(uid) {
        let obj = {
            userId: uid,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            type: listType,
            page: "available"
        }
        getListDataAPI(obj);
    }

    async function getListDataAPI(obj) {
        let res = await ApiCall("carrierListData", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("user List::", payload.data);
            setSearchText("");
            setListData(payload.data.data);
            setTotalRecords(payload.data.tatalRecords);
            let totalPage = Math.ceil(payload.data.tatalRecords / limit);
            setTotalPage(totalPage);
            let arr = [];
            for (let i = 1; i <= totalPage; i++) {
                arr.push(i);
            }
            setAllPageNumber(arr);

        } else if (res.success === false) {
            if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
                setListData([]);
            }
        }
    }

    function changePagination(e) {
        setLimit(e.target.value);
    }

    useEffect(() => {
        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * Number(limit)).toString(),
            type: listType,
            page: "available"
        }
        getListDataAPI(obj);

    }, [limit, currPage, listType]);

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

    function openViewModal(id, status) {
        setViewUserId(id);
        setViewCarrierStatus(status);
        let obj = {
            userId: id
        }
        getCarrierDetails(obj);
    }

    async function getCarrierDetails(obj) {
        let res = await ApiCall("carrierDetails", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("Payload Detail carrier::", payload.data);
            setViewCarrierDetails(payload.data);
            window.$('#viewApproveCarrierDetails').modal('show');
            // if (payload.data.status == 0 || payload.data.status == 1) {
            //     window.$('#viewApproveCarrierDetails').modal('show');
            // } else {
            //     window.$('#viewRejectedCarrierModal').modal('show');
            // }
        }
    }

    function changeSearchText(e) {
        setSearchText(e.target.value)
    }

    function changeCarrierType(e) {
        setCarrierType(e.target.value);
    }

    function clickApplyBtn() {
        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * Number(limit)).toString(),
            type: listType,
            searchText: searchText,
            carrierType: carrierType,
            page: "available"
        }
        getListDataAPI(obj);

    }

    function statusChange(e, uid) {
        if (!e.target.checked) {
            setViewUserId(uid);
            deactivateUser(uid);
        } else {
            activateUser(uid);
        }
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
    }

    async function statusChangeAPI(data) {
        let res = await ApiCall("userStatusChange", data);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            clickApplyBtn();
            if (data.status === "1") {
                toast.success(AlertMessage.MESSAGE.CARRIER.ACTIVATE)
            } else if (data.status === "0") {
                toast.success(AlertMessage.MESSAGE.CARRIER.DEACTIVATE)
            }
        }

    }

    async function exportList() {
        let obj = {
            userId: userId
        }
        let res = await ApiCall("carrierExport", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            window.open(IMAGE_URL + payload.data.response.fileName)
            toast.success("Download successfullly");
        } else {
            toast.error("Error occured !!!");
        }

    }

    function orderByDesc(data) {
        let filter = "";
        if (data === "carrierName") {
            filter = "carrierName"
        } else if (data === "carrierType") {
            filter = "carrierType"
        } else if (data === "vendorName") {
            filter = "vendorName"
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
            offset: ((currPage - 1) * Number(limit)).toString(),
            type: listType,
            searchText: searchText,
            carrierType: carrierType,
            sort: {
                column: filter,
                type: "DESC"
            },
            page: "available"
        }
        getListDataAPI(obj);
    }

    function orderByAsc(data) {
        let filter = "";
        if (data === "carrierName") {
            filter = "carrierName"
        } else if (data === "carrierType") {
            filter = "carrierType"
        } else if (data === "vendorName") {
            filter = "vendorName"
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
            offset: ((currPage - 1) * Number(limit)).toString(),
            type: listType,
            searchText: searchText,
            carrierType: carrierType,
            sort: {
                column: filter,
                type: "ASC"
            },
            page: "available"
        }
        getListDataAPI(obj);
    }
    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
            {/* <div className="wrapper">
                <Sidebar />
                <Header /> */}
            <div className="component-wrapper">


                <div className="page-head-section no_bor">
                    <h1 className="text-uppercase">Available Carriers</h1>
                    <div className="btn_dv exp_ad">
                        <button className="btn edt_btn" onClick={() => exportList()}><i className="fa fa-upload" aria-hidden="true"></i>Export</button>


                    </div>

                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">
                        <div className="new_rqst_tab">

                            <div className="available-carr">

                                <div className="" id="newrqst">
                                    <div className="filtr_sc">
                                        <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                                        <div className="filt dt_dv">
                                            <div class="dte">
                                                <input value="Date" type="text" class="" />
                                                <i class="fa fa-caret-down input-prefix active" aria-hidden="true"></i>

                                                <label for="datepicker"><i class="fa fa-calendar" aria-hidden="true">

                                                </i>
                                                    <input type="text" id="datepicker" autocomplete="off" placeholder="Select date" />
                                                </label>

                                            </div>



                                        </div>
                                        <div className="filt stus crerty">Carrier Type
                                            <select className="slec" value={carrierType} onChange={changeCarrierType}>
                                                <option value="">
                                                    All
                                                </option>
                                                {allCarrierType.length > 0 ?
                                                    <>{allCarrierType.map((data, i) => <React.Fragment key={i}>
                                                        <option value={data.id}>{data.lookupValue}</option>
                                                    </React.Fragment>)}
                                                    </> : <></>}
                                            </select></div>
                                        {/* <div className="filt stus crerty">Order Type <select className="slec">
                                                <option>
                                                    All
                                                </option>
                                            </select></div> */}


                                        <div className="filt aply"><button className="btn btn-aply" onClick={() => clickApplyBtn()}>Apply</button></div>
                                        <div className="filt srce">
                                            <input type="text" placeholder="Search Carrier by name, email or mobile number" value={searchText} onChange={changeSearchText} />
                                            <button className="btn fil-src_btn"><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="table-listing-app">
                                        <div className="table-responsive">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <th style={{ width: "6%" }}>ID #
                                                    </th>
                                                    <th style={{ width: "12%" }}>Carrier Name
                                                    <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "13%" }}>Vendor Name
                                                    <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("vendorName")} hidden={sort.column === "vendorName" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("vendorName")} hidden={sort.column === "vendorName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "6%" }}>Email ID
                                                    <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("email")} hidden={sort.column === "email" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("email")} hidden={sort.column === "email" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "12%" }}>Mobile No
                                                    <div className="sorting_btn">
                                                            <button className="t1" onClick={() => orderByAsc("phone")} hidden={sort.column === "phone" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("phone")} hidden={sort.column === "phone" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "8%" }}>Type
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "12%" }}>Registered On
                                                    <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("createDate")} hidden={sort.column === "createDate" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("createDate")} hidden={sort.column === "createDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    {userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN ?
                                                        <th style={{ width: "8%" }}>Status
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th> : <></>
                                                    }
                                                    <th style={{ width: "10%" }}>Availability
                                                        {/* <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                    </th>
                                                    <th style={{ width: "6%" }}>Action</th>
                                                </tr>
                                                {listData.length > 0 ? <React.Fragment>
                                                    {listData.map((data, i) => <React.Fragment key={i}>
                                                        <tr>
                                                            <td>{Number((currPage - 1) * limit) + (i + 1)}</td>
                                                            <td>{data.carrierName}</td>
                                                            {data.vendorName === null ? <td>N/A</td> :
                                                                <td>{data.vendorName}</td>
                                                            }
                                                            <td>{data.email}</td>
                                                            <td>+{data.countryCode} {data.phone}</td>
                                                            <td>{data.carrierType}</td>
                                                            <td>{SetScheduleDate(data.createDate)}</td>
                                                            {userTypeId === UsersEnums.APPLICATION_ROLE.ADMIN ?
                                                                <td>
                                                                    <div className="switch-plan-data">
                                                                        <div className="switch-toggle">
                                                                            <label className="switch">
                                                                                {data.activateStatus == 0 ?
                                                                                    <input id="xxxsx" type="checkbox" checked={false} name="xxxsx" onChange={(e) => statusChange(e, data.userId)} /> :
                                                                                    <input id="xxxsx" type="checkbox" checked={true} name="xxxsx" onChange={(e) => statusChange(e, data.userId)} />
                                                                                }
                                                                                <span className="slider round"></span> </label>
                                                                        </div>
                                                                    </div>
                                                                </td> : <></>
                                                            }
                                                            {data.activateStatus == 0 ?
                                                                <td className="red_txt">Busy</td> :
                                                                <td className="avle_txt">Available</td>
                                                            }
                                                            <td>
                                                                <div className="dropdown show">
                                                                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <img src="assets/images/three-dots.jpg" />
                                                                    </a>
                                                                    <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink3">


                                                                        <ul>

                                                                            <li><a href="#" data-toggle="modal"
                                                                                data-target="#exampleModal" onClick={() => openViewModal(data.userId, data.status)}>User Details</a>
                                                                            </li>
                                                                            <li><a href="#" data-toggle="modal"
                                                                                data-target="#exampleModal" onClick={() => openViewModal(data.userId, data.status)}>View Paperwork</a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>



                                                        </tr></React.Fragment>)}
                                                </React.Fragment> : <React.Fragment>
                                                    <tr>
                                                        <td colSpan="10" >
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                </React.Fragment>}
                                            </table>
                                        </div>
                                        <div className="peg_blo">
                                            <div className="dataTables_info" id="dtBasicExample_info" role="status" aria-live="polite">
                                                Showing <b>{(currPage - 1) * limit + 1} </b> to <b>{Number((currPage - 1) * limit) + listData.length} </b> of <b>{totalRecords} </b> entries</div>

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
                                                    href="#" aria-controls="dtBasicExample" data-dt-idx="0" tabindex="0"
                                                    className="page-link"><img src="assets/images/left-arrow.png" /></a></button>
                                                <button className="paginate_button page-item next" id="dtBasicExample_next" onClick={() => nextPage()}><a href="#"
                                                    aria-controls="dtBasicExample" data-dt-idx="7" tabindex="0"
                                                    className="page-link"><img src="assets/images/right-arrow.png" /></a></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
            {/* <!-- Modal career details--> */}
            <div className="modal fade bd-example-modal-md Carrier_pop" id="viewApproveCarrierDetails" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <ul className="nav nav-tabs">
                                <li className="nav-item active"> <a className="nav-link" data-toggle="tab" href="#carrernm">
                                    <div className="taber"><i className="fa fa-id-card-o" aria-hidden="true"></i> Career Details</div>
                                </a> </li>
                                <li className="nav-item "> <a className="nav-link" data-toggle="tab" href="#pprwrk">
                                    <div className="taber"><i className="fa fa-file-pdf-o" aria-hidden="true"></i> Paperwork</div>
                                </a> </li>

                            </ul>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="Carrier_pop">
                                <div className="new_rqst_tab">


                                    <div className="tab-content">

                                        <div className="tab-pane active" id="carrernm">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                {Object.keys(viewCarrierDetails).length > 0 ? <>
                                                    <tr>
                                                        <td align="left">Carrier Name</td>
                                                        <td align="right">{viewCarrierDetails.carrierName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Carrier Id #</td>
                                                        <td align="right">{viewCarrierDetails.userId}</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Carrier type</td>
                                                        <td align="right">{viewCarrierDetails.carrierType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Phone Number</td>
                                                        <td align="right">{viewCarrierDetails.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Email ID</td>
                                                        <td align="right">{viewCarrierDetails.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Status</td>
                                                        {viewCarrierDetails.status == 0 ? <td align="right" className="grn_txt">NEW</td> :
                                                            viewCarrierDetails.status == 1 ?
                                                                <td align="right" className="grn_txt">Approved</td> :
                                                                <td align="right" className="red_txt">Reject</td>
                                                        }
                                                    </tr>
                                                    <tr>
                                                        <td align="left">Requested On</td>
                                                        <td align="right">{SetScheduleDate(viewCarrierDetails.createDate)}</td>
                                                    </tr>
                                                    {viewCarrierDetails.status == 1 ?
                                                        <tr>
                                                            <td align="left">Approved On</td>
                                                            <td align="right">{SetScheduleDate(viewCarrierDetails.approveOrRjectDate)}</td>
                                                        </tr> : viewCarrierDetails.status == 2 ?
                                                            <tr>
                                                                <td align="left">Rejected On</td>
                                                                <td align="right">{SetScheduleDate(viewCarrierDetails.approveOrRjectDate)}</td>
                                                            </tr> : <></>
                                                    }
                                                </> : <></>}
                                            </table>
                                        </div>
                                        <div className="tab-pane" id="pprwrk">
                                            {/* <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="left">Carrier Name</td>
                                                    <td align="right">Carrier full name</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Carrier Id #</td>
                                                    <td align="right">123 456</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Carrier type</td>
                                                    <td align="right">Contractor</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Phone Number</td>
                                                    <td align="right">123 1213 9999</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Email ID</td>
                                                    <td align="right">johndeo@johndeo.com</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Status</td>
                                                    <td align="right" className="grn_txt">Active</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Availability</td>
                                                    <td align="right" className="avle_txt">Available</td>
                                                </tr>
                                                <tr>
                                                    <td align="left">Requested On</td>
                                                    <td align="right">11-11-2021</td>
                                                </tr>
                                            </table> */}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )

}