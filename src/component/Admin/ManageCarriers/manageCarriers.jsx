import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData, SetScheduleDate } from "../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";

export default function ManageCarriers() {

    const [listType, setListType] = useState("0");  // 0 -> New request, 1-> Approve request, 2 -> rejected request, all-> all data 
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
            type: listType
        }
        getListDataAPI(obj);
    }

    function onNewPage(type) {
        setListType(type);
        setSort({
            column: "",
            type: ""
        })
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
            type: listType
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

    async function approverequest(id) {
        let obj = {
            userId: id,
            status: "1",
            reason: ""
        }
        let res = await ApiCall("updateCarrierStatus", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            // let payload = Decoder.decode(res.response);
            let obj = {
                userId: userId,
                limit: limit,
                offset: ((currPage - 1) * Number(limit)).toString(),
                type: listType
            }
            getListDataAPI(obj);
            toast.success(AlertMessage.MESSAGE.CARRIER.APPROVE);
        }

    }

    function rejectRequest(id) {
        setViewUserId(id);
        window.$('#rejectModal').modal('show');

    }

    function reasonchange(e) {
        setReason(e.target.value)
    }

    async function rejectCarrier() {
        let obj = {
            userId: viewUserId,
            status: "2",
            reason: reason
        }
        let res = await ApiCall("updateCarrierStatus", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            // let payload = Decoder.decode(res.response);
            window.$('#rejectModal').modal('hide');
            setReason("");
            let obj = {
                userId: userId,
                limit: limit,
                offset: ((currPage - 1) * Number(limit)).toString(),
                type: listType
            }
            getListDataAPI(obj);
            toast.success(AlertMessage.MESSAGE.CARRIER.REJECT);
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

    function closeRejectModal() {
        window.$('#rejectModal').modal('hide');

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
            carrierType: carrierType
        }
        getListDataAPI(obj);

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
            }
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
            }
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
                    <h1 className="text-uppercase">Carriers Requests</h1>
                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">
                        <div className="new_rqst_tab">
                            <ul className="nav nav-tabs">
                                <li className="nav-item active" onClick={() => onNewPage("0")}> <a className="nav-link" data-toggle="tab" href="#newrqst">
                                    <div className="taber">New Request</div>
                                </a> </li>
                                <li className="nav-item " onClick={() => onNewPage("1")}> <a className="nav-link" data-toggle="tab" href="#apprrqst">
                                    <div className="taber">Approved Request</div>
                                </a> </li>
                                <li className="nav-item" onClick={() => onNewPage("2")}> <a className="nav-link" data-toggle="tab" href="#rejtrqst">
                                    <div className="taber">Rejected Request</div>
                                </a> </li>
                            </ul>
                            <div className="tab-content">

                                <div className="tab-pane active" id="newrqst">
                                    <div className="filtr_sc">
                                        <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                                        <div className="filt dt_dv">
                                            <div className="dte">
                                                <input value="Date" type="text" />
                                                <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                                <strong>Select date</strong>
                                            </div>

                                        </div>
                                        <div className="filt stus crerty">
                                            Carrier Type
                                            <select className="slec" value={carrierType} onChange={changeCarrierType}>
                                                <option value="">
                                                    All
                                                </option>
                                                {allCarrierType.length > 0 ?
                                                    <>{allCarrierType.map((data, i) => <React.Fragment key={i}>
                                                        <option value={data.id}>{data.lookupValue}</option>
                                                    </React.Fragment>)}
                                                    </> : <></>}
                                            </select>
                                        </div>
                                        {/* <div className="filt stus crerty">Order Type
                                                <select className="slec">
                                                    <option>
                                                        All
                                                    </option>
                                                </select>
                                            </div> */}


                                        <div className="filt aply"><button className="btn btn-aply" onClick={() => clickApplyBtn()}>Apply</button></div>
                                        <div className="filt srce">
                                            <input type="text" name="searchbox" placeholder="Search Carrier by name, email or mobile number" value={searchText} onChange={changeSearchText} />
                                            <button className="btn fil-src_btn"><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="table-listing-app">
                                        <div className="table-responsive">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <th style={{ width: "8%" }}>Carrier #
                                                        {/* <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                    </th>
                                                    <th style={{ width: "12%" }}>Carrier Name
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "12%" }}>Carrier Type
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierType")} hidden={sort.column === "carrierType" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("carrierType")} hidden={sort.column === "carrierType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
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
                                                    <th style={{ width: "12%" }}>Registered On
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("createDate")} hidden={sort.column === "createDate" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("createDate")} hidden={sort.column === "createDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "8%" }}>Status
                                                        {/* <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("status")} hidden={sort.column === "status" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("status")} hidden={sort.column === "status" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                    </th>
                                                    <th style={{ width: "6%" }}>Action</th>
                                                </tr>
                                                {listData.length > 0 ? <React.Fragment>
                                                    {listData.map((data, i) => <React.Fragment key={i}>
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td>{data.carrierName}</td>
                                                            <td>{data.carrierType}</td>
                                                            {data.vendorName === null ? <td>N/A</td> :
                                                                <td>{data.vendorName}</td>
                                                            }
                                                            <td>{data.email}</td>
                                                            <td>+{data.countryCode} {data.phone}</td>
                                                            <td>{SetScheduleDate(data.createDate)}</td>
                                                            {data.status == 0 ?
                                                                <td className="dgrn_txt">NEW</td> :
                                                                data.status == 1 ? <td className="grn_txt">APPROVED</td> :
                                                                    <td className="red_txt">REJECTED</td>
                                                            }
                                                            <td>

                                                                <div className="dropdown show">
                                                                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <img src="assets/images/three-dots.jpg" />
                                                                    </a>
                                                                    <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">


                                                                        <ul>
                                                                            <li><a href="javascript:void(0)" onClick={() => openViewModal(data.userId, data.status)}>View Details</a>
                                                                            </li>
                                                                            <li><a href="javascript:void(0)" onClick={() => approverequest(data.userId)}>Approve</a>
                                                                            </li>
                                                                            <li><a href="javascript:void(0)" onClick={() => rejectRequest(data.userId)}>Reject</a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>)}
                                                </React.Fragment> : <React.Fragment>
                                                    <tr>
                                                        <td colSpan="9" >
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                </React.Fragment>}
                                                {/* <tr>
                                                    <td>123456</td>
                                                    <td>Career full name</td>
                                                    <td>Employee</td>
                                                    <td>Vendor full name</td>
                                                    <td>contact@joh...</td>
                                                    <td>+1 125 100 999</td>
                                                    <td>10-12-2021</td>
                                                    <td className="red_txt">REJECTED</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink2">


                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal5">View Details</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal2">Approve</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal5">Reject</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>123456</td>
                                                    <td>Career full name</td>
                                                    <td>Employee</td>
                                                    <td>Vendor full name</td>
                                                    <td>contact@joh...</td>
                                                    <td>+1 125 100 999</td>
                                                    <td>10-12-2021</td>
                                                    <td className="grn_txt">APPROVED</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink3">


                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal5">View Details</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal2">Approve</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal5">Reject</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr> */}
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
                                            <div className="dataTables_length bs-select" id="dtBasicExample_length">
                                                <label>
                                                    Show
                                                    <select name="dtBasicExample_length" aria-controls="dtBasicExample" className="custom-select custom-select-sm form-control form-control-sm" value={limit} onChange={changePagination}>
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </select>
                                                    rows
                                                </label>
                                            </div>
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
                                <div className="tab-pane  " id="apprrqst">
                                    <div className="filtr_sc">
                                        <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                                        <div className="filt dt_dv">
                                            <div className="dte">
                                                <input value="Date" type="text" className="" />
                                                <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                                <strong>Select date</strong>
                                            </div>

                                        </div>
                                        {/* <div className="filt stus">status <select className="slec">
                                            <option>
                                                All
                                            </option>
                                        </select></div> */}
                                        <div className="filt aply"><button className="btn btn-aply" onClick={() => clickApplyBtn()}>Apply</button></div>
                                        <div className="filt srce">
                                            <input type="text" name="searchAvailable" placeholder="Search Carrier by name, email or mobile number" value={searchText} onChange={changeSearchText} />
                                            <button className="btn fil-src_btn"><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="amaz-carr-tab">

                                        <div className="table-listing-app">
                                            <div className="table-responsive">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "12%" }} align="center">Carrier Name
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "12%" }} align="center">Email ID
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("email")} hidden={sort.column === "email" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("email")} hidden={sort.column === "email" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "14%" }} align="center">Mobile Number
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("phone")} hidden={sort.column === "phone" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("phone")} hidden={sort.column === "phone" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }} align="center">Request on
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("createDate")} hidden={sort.column === "createDate" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("createDate")} hidden={sort.column === "createDate" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "12%" }} align="center">Approved on
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1"><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "8%" }} align="center">Status
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1"><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "6%" }} align="center">Action</th>
                                                    </tr>
                                                    {listData.length > 0 ? <React.Fragment>
                                                        {listData.map((data, i) => <React.Fragment>
                                                            <tr>
                                                                <td align="center">{data.carrierName}</td>
                                                                <td align="center">{data.email}</td>
                                                                <td align="center">+{data.countryCode} {data.phone}</td>
                                                                <td align="center">{SetScheduleDate(data.createDate)}</td>
                                                                <td align="center">{SetScheduleDate(data.approveOrRjectDate)}</td>
                                                                {data.status == 0 ?
                                                                    <td align="center" className="dgrn_txt">NEW</td> :
                                                                    data.status == 1 ? <td className="grn_txt">APPROVED</td> :
                                                                        <td className="red_txt">REJECTED</td>
                                                                }

                                                                <td align="center">
                                                                    <div className="tbl-editing-links">
                                                                        <button className="tr-toggle" onClick={() => openViewModal(data.userId, data.status)}>
                                                                            <i className="fa fa-eye" aria-hidden="true"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>)}
                                                    </React.Fragment> : <React.Fragment>
                                                        <tr>
                                                            <td colSpan="7" >
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>}
                                                    {/* <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr> */}

                                                </table>
                                            </div>
                                        </div>
                                        <div className="peg_blo">
                                            <div className="dataTables_info" id="dtBasicExample_info" role="status"
                                                aria-live="polite">
                                                Showing <b>{(currPage - 1) * limit + 1} </b>
                                                to <b>{Number((currPage - 1) * limit) + listData.length} </b>
                                                of <b>{totalRecords}</b> entries</div>

                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="dtBasicExample_paginate">
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
                                            <div className="dataTables_length bs-select" id="dtBasicExample_length"><label>Show
                                                <select name="dtBasicExample_length" aria-controls="dtBasicExample"
                                                    className="custom-select custom-select-sm form-control form-control-sm" value={limit} onChange={changePagination}>
                                                    <option value="10">10</option>
                                                    <option value="25">25</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                </select> rows</label></div>
                                            <div className="pag_btn">
                                                <button className="paginate_button page-item previous"
                                                    id="dtBasicExample_previous" onClick={() => previousPage()}><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="0" tabindex="0" className="page-link"><img
                                                            src="assets/images/left-arrow.png" /></a></button>
                                                <button className="paginate_button page-item next" id="dtBasicExample_next" onClick={() => nextPage()}><a
                                                    href="#" aria-controls="dtBasicExample" data-dt-idx="7" tabindex="0"
                                                    className="page-link"><img
                                                        src="assets/images/right-arrow.png" /></a></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>




                                <div className="tab-pane" id="rejtrqst">
                                    <div className="filtr_sc">
                                        <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                                        <div className="filt dt_dv">
                                            <div className="dte">
                                                <input value="Date" type="text" className="" />
                                                <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                                <strong>Select date</strong>
                                            </div>

                                        </div>
                                        <div className="filt stus">status <select className="slec">
                                            <option>
                                                All
                                            </option>
                                        </select></div>
                                        <div className="filt aply"><button className="btn btn-aply" onClick={() => clickApplyBtn()}>Apply</button></div>
                                        <div className="filt srce">
                                            <input type="text" placeholder="Search Carrier by name, email or mobile number" value={searchText} onChange={changeSearchText} />
                                            <button className="btn fil-src_btn"><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="amaz-carr-tab">

                                        <div className="table-listing-app">
                                            <div className="table-responsive">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "12%" }} align="center">Carrier Name
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "12%" }} align="center">Email ID
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("email")} hidden={sort.column === "email" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("email")} hidden={sort.column === "email" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "14%" }} align="center">Mobile Number
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("phone")} hidden={sort.column === "phone" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("phone")} hidden={sort.column === "phone" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }} align="center">Request on
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("createDate")} hidden={sort.column === "createDate" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("createDate")} hidden={sort.column === "createDate" && sort.type === "DESC"}><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "12%" }} align="center">Approved on
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1"><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "8%" }} align="center">Status
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1"><img
                                                                        src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "6%" }} align="center">Action</th>
                                                    </tr>
                                                    {listData.length > 0 ? <React.Fragment>
                                                        {listData.map((data, i) => <React.Fragment key={i}>
                                                            <tr>
                                                                <td align="center">{data.carrierName}</td>
                                                                <td align="center">{data.email}</td>
                                                                <td align="center">+{data.countryCode} {data.phone}</td>
                                                                <td align="center">{SetScheduleDate(data.createDate)}</td>
                                                                <td align="center">{SetScheduleDate(data.approveOrRjectDate)}</td>
                                                                {data.status == 0 ?
                                                                    <td align="center" className="dgrn_txt">NEW</td> :
                                                                    data.status == 1 ? <td className="grn_txt">APPROVED</td> :
                                                                        <td align="center" className="red_txt">REJECTED</td>
                                                                }

                                                                <td align="center">
                                                                    <div className="tbl-editing-links">
                                                                        <button onClick={() => openViewModal(data.userId, data.status)} className="tr-toggle"><i
                                                                            className="fa fa-eye" aria-hidden="true"></i>
                                                                        </button>


                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        </React.Fragment>)}
                                                    </React.Fragment> : <React.Fragment>
                                                        <tr>
                                                            <td colSpan="7" >
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>}
                                                    {/* <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                        <tr>

                                                            <td align="center">John Deo</td>
                                                            <td align="center">contact@johndeo.com</td>
                                                            <td align="center">+1 125 100 999</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">10-12-2021</td>
                                                            <td align="center">
                                                                <button class='btn aprv-btn-nb'>Approved</button>
                                                            </td>
                                                            <td align="center">
                                                                <div className="tbl-editing-links"><button className="tr-toggle"><i
                                                                    className="fa fa-eye" aria-hidden="true"></i>
                                                                </button>

                                                                </div>
                                                            </td>

                                                        </tr> */}
                                                </table>
                                            </div>
                                        </div>
                                        <div className="peg_blo">
                                            <div className="dataTables_info" id="dtBasicExample_info" role="status"
                                                aria-live="polite">
                                                Showing <b>{(currPage - 1) * limit + 1}</b> to <b>{Number((currPage - 1) * limit) + listData.length}</b> of <b>{totalRecords}</b> entries</div>

                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="dtBasicExample_paginate">
                                                <ul className="pagination">
                                                    {allPageNumber.length > 0 ? <>
                                                        {allPageNumber.map((page, p) => <React.Fragment key={p}>
                                                            <li className="paginate_button page-item " id={"pg_" + p + 1} onClick={() => changePage(p + 1)}>
                                                                <a href="javascript:void(0)" aria-controls="dtBasicExample" data-dt-idx="1" tabindex="0" className="page-link">{page}</a>
                                                            </li>
                                                        </React.Fragment>)}
                                                    </> : <></>}

                                                </ul>
                                            </div>
                                            <div className="dataTables_length bs-select" id="dtBasicExample_length"><label>Show
                                                <select name="dtBasicExample_length" aria-controls="dtBasicExample"
                                                    className="custom-select custom-select-sm form-control form-control-sm" value={limit} onChange={changePagination}>
                                                    <option value="10">10</option>
                                                    <option value="25">25</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                </select> rows</label></div>
                                            <div className="pag_btn">
                                                <button className="paginate_button page-item previous"
                                                    id="dtBasicExample_previous" onClick={() => previousPage()}>
                                                    <a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="0" tabindex="0" className="page-link">
                                                        <img src="assets/images/left-arrow.png" />
                                                    </a>
                                                </button>
                                                <button className="paginate_button page-item next" id="dtBasicExample_next" onClick={() => nextPage()}>
                                                    <a href="#" aria-controls="dtBasicExample" data-dt-idx="7" tabindex="0"
                                                        className="page-link">
                                                        <img src="assets/images/right-arrow.png" />
                                                    </a>
                                                </button>
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
            <div className="modal fade bd-example-modal-md" id="viewRejectedCarrierModal" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-id-card-o" aria-hidden="true"></i>
                                Carrier Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="Carrier_pop">
                                <table width="100%" cellpadding="0" cellspacing="0">
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
                                        <td align="right" className="red_txt">Reject</td>
                                    </tr>
                                    <tr>
                                        <td align="left">Requested On</td>
                                        <td align="right">11-11-2021</td>
                                    </tr>
                                    <tr>
                                        <td align="left">Rejected On</td>
                                        <td align="right">12-11-2021</td>
                                    </tr>
                                </table>
                                <div className="alert alert-danger"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> <strong>Reason</strong> Carrier rejection reason text. Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- Modal career details--> */}
            <div className="modal fade bd-example-modal-md" id="viewApproveCarrierDetails" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel6" aria-hidden="true">
                <div className="modal-dialog modal-md usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-id-card-o" aria-hidden="true"></i>
                                Carrier Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="Carrier_pop">
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
                                {Object.keys(viewCarrierDetails).length > 0 ? <>
                                    {
                                        viewCarrierDetails.status == 2 ?
                                            <div className="alert alert-danger">
                                                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                                                <strong>Reason : </strong>
                                                {viewCarrierDetails.reason}
                                            </div> : <></>
                                    } </> : <></>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/*<!-- Modal edit userdetails-->*/}
            <div className="modal fade bd-example-modal-lg" id="exampleModal2" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel2" aria-hidden="true">
                <div className="modal-dialog modal-lg usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"><i className="fa fa-pencil" aria-hidden="true"></i>
                                Edit User Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="_fl ppedit pr1">
                                <div className="usr_ed_pop">
                                    <div className="edit_file addnew_us">
                                        <div className="edit_file_in">
                                            <div className="ed_nm flunm"><label>Full Name</label><input type="text" value=""
                                                placeholder="Judy K Walke" /><i class="fa fa-check" aria-hidden="true"></i><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                                            <div className="ed_nm mob_nm"><label>Mobile Number</label><input type="text" value=""
                                                placeholder="1234567890" /><i class="fa fa-check" aria-hidden="true"></i><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                                            <div className="ed_nm role"><label>Role</label><input type="text" value=""
                                                placeholder="Judy K Walke" /><i class="fa fa-check" aria-hidden="true"></i><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                                            <div className="ed_nm emlid"><label>Email ID</label><input type="text" value=""
                                                placeholder="johndeo2022@johdeocompany.com" /><i class="fa fa-check" aria-hidden="true"></i><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
                                        </div>
                                    </div>

                                    <div className="drag_img">
                                        <img src="assets/images/cmr.png" />
                                        <label>Drag N Drop or Choose image</label>
                                        <p>max allowed image size 500 kb<br /> Please use only jpg/jpeg/png</p>
                                    </div>


                                    <div className="btn_dv">
                                        <button className="btn btn-grn">Submit</button>
                                        <button className="btn btn-whi">Reset</button>
                                        <p><strong><i className="fa fa-check" aria-hidden="true"></i> Success!</strong>Data has
                                            been updated</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            {/*<!-- Modal reset password-->*/}
            <div className="modal fade" id="exampleModal3" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel3"
                aria-hidden="true">
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
                            <div className="edit_file_in res_pss">
                                <div className="ed_nm flunm"><label>Password</label><input type="password" value=""
                                    placeholder="******" /><i className="fa fa-check" aria-hidden="true"></i>
                                    <p>* Minimum 6 characters<br />* At least one small alphabet<br />* At least one number<br />*
                                        At least one special characters</p>
                                </div>
                                <div className="ed_nm mob_nm"><label>Confirm Password</label><input type="password" value=""
                                    placeholder="******" /><i className="fa fa-check" aria-hidden="true"></i>
                                    <p>password matched</p>
                                </div>
                            </div>
                            <div className="btn_dv reser_pass">
                                <button className="btn btn-grn">Submit</button>
                                <button className="btn btn-whi">Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/*<!-- Modal sure activate-->*/}
            <div className="modal fade" id="exampleModal4" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel4"
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
                                <button className="btn btn-red">Deactivate</button>
                                <button className="btn btn-whi">Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/*<!-- Modal sure activate-->*/}
            <div className="modal bd-example-modal-sm fade" id="rejectModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel54"
                aria-hidden="true">
                <div className="modal-dialog modal-sm usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="sure_act">
                                <strong>Are you sure?</strong>
                                <p>Do you really want to deactivate this Carrier?</p>
                                <div className="resn_sc">
                                    <label>
                                        <strong>Reason </strong>(Requested)
                                    </label>
                                    <textarea placeholder="Please enter reason..." value={reason} onChange={reasonchange}></textarea>
                                </div>

                            </div>
                            <div className="btn_dv de_act">
                                <button className="btn btn-red" onClick={() => rejectCarrier()}>Reject</button>
                                <button className="btn btn-whi" onClick={() => closeRejectModal()}>Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}