import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL } from "../../../services/apiConfig/config";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData, SetScheduleDate } from "../../../services/commonFunction/commonFunction";
import { ErrorCode, UsersEnums } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";

const reqData = {
    limit: "10",
    offset: "",
    userId: "",
    searchText: "",
    status: "",
    loadType: "",
    startDate: "",
    endDate: "",
    orderType: "",
    carrierIds: "",
    sort: {
        column: "",
        type: ""
    }
};

export default function OrderManagement() {

    let navigate = useHistory();

    const [limit, setLimit] = useState("10");
    const [currPage, setCurrPage] = useState("1");
    const [totalPage, setTotalPage] = useState("1");
    const [listData, setListData] = useState([]);
    const [userId, setUserId] = useState("");
    const [userTypeId, setUserTypeId] = useState("");
    const [landingData, setAllLandingData] = useState([]);
    const [allPageNumber, setAllPageNumber] = useState([]);
    const [allCarrierType, setAllCarrierType] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [totalRecords, setTotalRecords] = useState("");
    const [sort, setSort] = useState({
        column: "",
        type: ""
    });
    const [status, setStatus] = useState("")

    useEffect(async () => {
        let authUser = getLocalStorageData();
        setUserId(authUser.data.userId);
        setUserTypeId(authUser.data.userTypeId);
        if (landingData.length == 0) {
            let data = await getLandingDataFromAPI();
            setAllLandingData(data);
            if (data.carrierType.length > 0) {
                setAllCarrierType(data.carrierType);
            }
        }
        let obj = {
            userId: authUser.data.userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            status: status
        }
        let reqObj = Object.assign(reqData, obj);
        getListData(reqObj);
    }, [limit, currPage, status]);

    async function getListData(obj) {
        let res = await ApiCall("orderList", obj);
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

    function onNewPage(type) {
        setStatus(type);
        setSort({
            column: "",
            type: ""
        })
    }

    // useEffect(() => {
    //     let obj = {
    //         userId: userId,
    //         limit: limit,
    //         offset: ((currPage - 1) * Number(limit)).toString(),
    //         type: listType
    //     }
    //     getListDataAPI(obj);

    // }, [limit, currPage, listType]);

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

    function changeSearchText(e) {
        setSearchText(e.target.value)
    }

    function clickSearch() {
        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText
        }
        let reqObj = Object.assign(reqData, obj);
        getListData(reqObj);

    }

    function orderByDesc(data) {
        let filter = "";
        if (data === "orderId") {
            filter = "orderId"
        } else if (data === "legId") {
            filter = "legId"
        } else if (data === "customerName") {
            filter = "customerName"
        } else if (data === "orderDate") {
            filter = "orderDate"
        } else if (data === "OrderType") {
            filter = "OrderType"
        } else if (data === "loadType") {
            filter = "loadType"
        } else if (data === "orderStatus") {
            filter = "orderStatus"
        } else if (data === "price") {
            filter = "price"
        } else if (data === "carrierName") {
            filter = "carrierName"
        }

        setSort({
            column: filter,
            type: "DESC"
        });

        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText,
            sort: {
                column: filter,
                type: "DESC"
            }
        }
        let reqObj = Object.assign(reqData, obj);
        getListData(reqObj);
    }

    function orderByAsc(data) {
        let filter = "";
        if (data === "orderId") {
            filter = "orderId"
        } else if (data === "legId") {
            filter = "legId"
        } else if (data === "customerName") {
            filter = "customerName"
        } else if (data === "orderDate") {
            filter = "orderDate"
        } else if (data === "OrderType") {
            filter = "OrderType"
        } else if (data === "loadType") {
            filter = "loadType"
        } else if (data === "orderStatus") {
            filter = "orderStatus"
        } else if (data === "price") {
            filter = "price"
        } else if (data === "carrierName") {
            filter = "carrierName"
        }

        setSort({
            column: filter,
            type: "ASC"
        });

        let obj = {
            userId: userId,
            limit: limit,
            offset: ((currPage - 1) * limit).toString(),
            searchText: searchText,
            sort: {
                column: filter,
                type: "ASC"
            }
        }

        let reqObj = Object.assign(reqData, obj);
        getListData(reqObj);
    }

    function goViewOrderDetails(id) {
        navigate.push({
            pathname: "/viewJobDetails",
            state: id
        });
    }

    function goEditOrderDetails(id) {
        navigate.push({
            pathname: "/editJobDetails",
            state: id
        });
    }

    async function exportList() {
        let obj = {
            userId: userId
        }
        let res = await ApiCall("exportOrderList", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            window.open(IMAGE_URL + payload.data.response.fileName)
            toast.success("Download successfullly");
        } else {
            toast.error("Error occured !!!");
        }

    }

    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
            <div className="component-wrapper">
                <div className="page-head-section no_bor">
                    {userTypeId == UsersEnums.APPLICATION_ROLE.DISPATCHER ?
                        <h1 className="text-uppercase">Manage Jobs</h1> :
                        <h1 className="text-uppercase">Order Management</h1>
                    }
                    <div className="btn_dv exp_ad">
                        <button className="btn edt_btn" onClick={() => exportList()}><i className="fa fa-upload" aria-hidden="true"></i>Export</button>
                        {/* <button className="btn edt_btn"><i class="fa fa-plus-circle" aria-hidden="true"></i>Create job</button> */}
                    </div>
                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">

                        <div className="new_rqst_tab order_management">
                            <ul className="nav nav-tabs">
                                <li className="nav-item active" onClick={() => onNewPage("")}> <a className="nav-link" data-toggle="tab" href="#allorder">
                                    <div className="taber">All Order</div>
                                </a> </li>
                                <li className="nav-item" onClick={() => onNewPage("0")}> <a className="nav-link" data-toggle="tab" href="#pendingorder">
                                    <div className="taber">Pending Order</div>
                                </a> </li>
                                <li className="nav-item" onClick={() => onNewPage("1")}> <a className="nav-link" data-toggle="tab" href="#ongoingorder">
                                    <div className="taber">Ongoing Order</div>
                                </a> </li>
                                <li className="nav-item" onClick={() => onNewPage("4")}> <a className="nav-link" data-toggle="tab" href="#pastorder">
                                    <div className="taber">Past Order</div>
                                </a> </li>
                            </ul>
                            <div className="tab-content">

                                <div className="tab-pane active" id="allorder">
                                    <div className="filtr_sc">
                                        <div className="dropdown show filt fil_b">
                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fa fa-filter" aria-hidden="true"></i> <strong>Filter</strong> <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </a>
                                            <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink1">

                                                <div className="dte">
                                                    <input value="Date Range" type="text" />
                                                    <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                    <i className="fa fa-calendar" aria-hidden="true"></i>
                                                    <strong>Select date</strong>
                                                </div>
                                                <div className="dat_sl_sc">
                                                    <div className="sel_opn">
                                                        <label>State</label>
                                                        <select><option>All</option></select>
                                                    </div>
                                                    <div className="sel_opn">
                                                        <label>Lod Type</label>
                                                        <select><option>All</option></select>
                                                    </div>
                                                    <div className="sel_opn">
                                                        <label>Order Category</label>
                                                        <select><option>All</option></select>
                                                    </div>
                                                    <div className="sel_opn">
                                                        <label>Carrier</label>
                                                        <select><option>All</option></select>
                                                    </div>


                                                </div>
                                                <div class="btn_dv"><button class="btn btn-grn"><i class="fa fa-check" aria-hidden="true"></i> Apply</button><button class="btn btn-whi"><i class="fa fa-times" aria-hidden="true"></i> Reset</button></div>
                                            </div>


                                        </div>

                                        <div className="filt srce">
                                            <input type="text" placeholder="Search Order by Order #, Customer" value={searchText} onChange={changeSearchText} />
                                            <button className="btn fil-src_btn" onClick={() => clickSearch()}><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="table-listing-app">
                                        <div className="table-responsive">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <th style={{ width: "8%" }}>Order #
                                                        <div className="sorting_btn">
                                                            <button className="t1" onClick={() => orderByAsc("orderId")} hidden={sort.column === "orderId" && sort.type === "ASC"}>
                                                                <img src="assets/images/sorting-btn1.jpg" />
                                                            </button>
                                                            <button className="t1" onClick={() => orderByDesc("orderId")} hidden={sort.column === "orderId" && sort.type === "DESC"}>
                                                                <img src="assets/images/sorting-btn2.jpg" />
                                                            </button>
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "7%" }}>Leg ID
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("legId")} hidden={sort.column === "legId" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("legId")} hidden={sort.column === "legId" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>Customer
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("customerName")} hidden={sort.column === "customerName" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("customerName")} hidden={sort.column === "customerName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "9.8%" }}>Order Date
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10.8%" }}>Order Type
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>Load Type
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("loadType")} hidden={sort.column === "loadType" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("loadType")} hidden={sort.column === "loadType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10.6%" }}>Total Bids
                                                        {/* <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                    </th>
                                                    <th style={{ width: "7.1%" }}>Status
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>Assigned
                                                        {/* <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                    </th>
                                                    <th style={{ width: "9.1%" }}>Carrier #
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>$ Price
                                                        <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("price")} hidden={sort.column === "price" && sort.type === "ASC"}><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1" onClick={() => orderByDesc("price")} hidden={sort.column === "price" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>

                                                    <th style={{ width: "4%" }}>Action</th>
                                                </tr>
                                                {listData.length > 0 ? <React.Fragment>

                                                    {listData.map((data, i) => <React.Fragment key={i}>

                                                        <tr>
                                                            <td>{data.orderId}</td>
                                                            <td>{data.legId}</td>
                                                            <td>{data.Customer}</td>
                                                            <td>{SetScheduleDate(data.orderDate)}</td>
                                                            <td>{data.OrderType}</td>
                                                            <td>{data.loadType}</td>
                                                            <td>N/A</td>
                                                            {data.orderStatus == 0 ?
                                                                <td className="yel_txt"><strong>Pending</strong></td> : <>
                                                                    {data.orderStatus == 1 ? <>
                                                                        <td className="sky_txt"><strong>Outgoing</strong></td>
                                                                    </> : <>
                                                                        {data.orderStatus == 2 ? <>
                                                                            <td className="red_txt"><strong>Cancelled</strong></td>
                                                                        </> : <>
                                                                            {data.orderStatus == 3 ? <>
                                                                                <td className="blu_txt"><strong>Partial Completion</strong></td>
                                                                            </> : <>
                                                                                <td className="dgrn_txt"><strong>Completed</strong></td>
                                                                            </>}
                                                                        </>}
                                                                    </>}
                                                                </>}
                                                            <td>N/A</td>
                                                            <td>N/A</td>
                                                            <td className="dgrn_txt">$ {data.price}</td>
                                                            <td>
                                                                <div className="dropdown show">
                                                                    <a className="btn btn-secondary dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <img src="assets/images/three-dots.jpg" />
                                                                    </a>
                                                                    <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                        <ul>
                                                                            <li><a href="javascript:void(0)" onClick={() => goViewOrderDetails(data.id)}>View Details</a></li>
                                                                            <li><a href="javascript:void(0)" onClick={() => goEditOrderDetails(data.id)}>Edit</a></li>
                                                                            <li><a href="javascript:void(0)" >View Bids</a></li>
                                                                            <li><a href="javascript:void(0)" >Assign Carrier</a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr></React.Fragment>)}
                                                </React.Fragment> : <React.Fragment>
                                                    <tr>
                                                        <td colSpan="12" >
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                </React.Fragment>}
                                                {/* <tr>
                                                    <td>1208</td>
                                                    <td>423 852</td>
                                                    <td>Norman Farrelly</td>
                                                    <td>10-10-2021</td>
                                                    <td>Local</td>
                                                    <td>Round Trip</td>
                                                    <td>1608</td>
                                                    <td className="sky_txt"><strong>Outgoing</strong></td>
                                                    <td>Susan Lucas</td>
                                                    <td>159 523</td>
                                                    <td className="dgrn_txt">$ 125,000</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>1208</td>
                                                    <td>423 852</td>
                                                    <td>Norman Farrelly</td>
                                                    <td>10-10-2021</td>
                                                    <td>Local</td>
                                                    <td>Round Trip</td>
                                                    <td>1608</td>
                                                    <td className="red_txt"><strong>Cancelled</strong></td>
                                                    <td>Susan Lucas</td>
                                                    <td>159 523</td>
                                                    <td className="dgrn_txt">$ 125,000</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>1208</td>
                                                    <td>423 852</td>
                                                    <td>Norman Farrelly</td>
                                                    <td>10-10-2021</td>
                                                    <td>Local</td>
                                                    <td>Round Trip</td>
                                                    <td>1608</td>
                                                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                                                    <td>Susan Lucas</td>
                                                    <td>159 523</td>
                                                    <td className="dgrn_txt">$ 125,000</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>1208</td>
                                                    <td>423 852</td>
                                                    <td>Norman Farrelly</td>
                                                    <td>10-10-2021</td>
                                                    <td>Local</td>
                                                    <td>Round Trip</td>
                                                    <td>1608</td>
                                                    <td className="dgrn_txt"><strong>Completed</strong></td>
                                                    <td>Susan Lucas</td>
                                                    <td>159 523</td>
                                                    <td className="dgrn_txt">$ 125,000</td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                <ul>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
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
                                                                <a href="#" aria-controls="dtBasicExample"
                                                                    data-dt-idx="1" tabindex="0" className="page-link">1</a></li>
                                                        </React.Fragment>)}
                                                    </> : <></>}
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

                                                </ul>
                                            </div>
                                            <div className="dataTables_length bs-select" id="dtBasicExample_length">
                                                <label>Show
                                                    <select name="dtBasicExample_length" aria-controls="dtBasicExample"
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
                                <div className="tab-pane" id="pendingorder">

                                    <div className="tab-pane active" id="allorder">
                                        <div className="filtr_sc">
                                            <div className="dropdown show filt fil_b">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fa fa-filter" aria-hidden="true"></i> <strong>Filter</strong> <i className="fa fa-caret-down" aria-hidden="true"></i>
                                                </a>
                                                <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink1">

                                                    <div className="dte">
                                                        <input value="Date Range" type="text" />
                                                        <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                                        <strong>Select date</strong>
                                                    </div>
                                                    <div className="dat_sl_sc">
                                                        <div className="sel_opn">
                                                            <label>State</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Lod Type</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Order Category</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Carrier</label>
                                                            <select><option>All</option></select>
                                                        </div>


                                                    </div>
                                                    <div class="btn_dv"><button class="btn btn-grn"><i class="fa fa-check" aria-hidden="true"></i> Apply</button><button class="btn btn-whi"><i class="fa fa-times" aria-hidden="true"></i> Reset</button></div>
                                                </div>


                                            </div>

                                            <div className="filt srce">
                                                <input type="text" placeholder="Search Order by Order #, Customer" value={searchText} onChange={changeSearchText} />
                                                <button className="btn fil-src_btn" onClick={() => clickSearch()}><i className="fa fa-search" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="table-listing-app">
                                            <div className="table-responsive">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "8%" }}>Order #
                                                            <div className="sorting_btn">
                                                                <button className="t1" onClick={() => orderByAsc("orderId")} hidden={sort.column === "orderId" && sort.type === "ASC"}>
                                                                    <img src="assets/images/sorting-btn1.jpg" />
                                                                </button>
                                                                <button className="t1" onClick={() => orderByDesc("orderId")} hidden={sort.column === "orderId" && sort.type === "DESC"}>
                                                                    <img src="assets/images/sorting-btn2.jpg" />
                                                                </button>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "7%" }}>Leg ID
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("legId")} hidden={sort.column === "legId" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("legId")} hidden={sort.column === "legId" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Customer
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("customerName")} hidden={sort.column === "customerName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("customerName")} hidden={sort.column === "customerName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "9.8%" }}>Order Date
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.8%" }}>Order Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Load Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("loadType")} hidden={sort.column === "loadType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("loadType")} hidden={sort.column === "loadType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.6%" }}>Total Bids
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "7.1%" }}>Status
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Assigned
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "9.1%" }}>Carrier #
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>$ Price
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("price")} hidden={sort.column === "price" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("price")} hidden={sort.column === "price" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>

                                                        <th style={{ width: "4%" }}>Action</th>
                                                    </tr>
                                                    {listData.length > 0 ? <React.Fragment>

                                                        {listData.map((data, i) => <React.Fragment key={i}>

                                                            <tr>
                                                                <td>{data.orderId}</td>
                                                                <td>{data.legId}</td>
                                                                <td>{data.Customer}</td>
                                                                <td>{SetScheduleDate(data.orderDate)}</td>
                                                                <td>{data.OrderType}</td>
                                                                <td>{data.loadType}</td>
                                                                <td>N/A</td>
                                                                {data.orderStatus == 0 ?
                                                                    <td className="yel_txt"><strong>Pending</strong></td> : <>
                                                                        {data.orderStatus == 1 ? <>
                                                                            <td className="sky_txt"><strong>Outgoing</strong></td>
                                                                        </> : <>
                                                                            {data.orderStatus == 2 ? <>
                                                                                <td className="red_txt"><strong>Cancelled</strong></td>
                                                                            </> : <>
                                                                                {data.orderStatus == 3 ? <>
                                                                                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                                                                                </> : <>
                                                                                    <td className="dgrn_txt"><strong>Completed</strong></td>
                                                                                </>}
                                                                            </>}
                                                                        </>}
                                                                    </>}
                                                                <td>N/A</td>
                                                                <td>N/A</td>
                                                                <td className="dgrn_txt">$ {data.price}</td>
                                                                <td>
                                                                    <div className="dropdown show">
                                                                        <a className="btn btn-secondary dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <img src="assets/images/three-dots.jpg" />
                                                                        </a>
                                                                        <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                            <ul>
                                                                                <li><a href="javascript:void(0)" onClick={() => goViewOrderDetails(data.id)}>View Details</a></li>
                                                                                <li><a href="javascript:void(0)" onClick={() => goEditOrderDetails(data.id)}>Edit</a></li>
                                                                                <li><a href="javascript:void(0)" >View Bids</a></li>
                                                                                <li><a href="javascript:void(0)" >Assign Carrier</a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr></React.Fragment>)}
                                                    </React.Fragment> : <React.Fragment>
                                                        <tr>
                                                            <td colSpan="12" >
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>}
                                                    {/* <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="sky_txt"><strong>Outgoing</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="red_txt"><strong>Cancelled</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="dgrn_txt"><strong>Completed</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
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
                                                                    <a href="#" aria-controls="dtBasicExample"
                                                                        data-dt-idx="1" tabindex="0" className="page-link">1</a></li>
                                                            </React.Fragment>)}
                                                        </> : <></>}
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

                                                    </ul>
                                                </div>
                                                <div className="dataTables_length bs-select" id="dtBasicExample_length">
                                                    <label>Show
                                                        <select name="dtBasicExample_length" aria-controls="dtBasicExample"
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
                                <div className="tab-pane" id="ongoingorder">

                                    <div className="tab-pane active" id="allorder">
                                        <div className="filtr_sc">
                                            <div className="dropdown show filt fil_b">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fa fa-filter" aria-hidden="true"></i> <strong>Filter</strong> <i className="fa fa-caret-down" aria-hidden="true"></i>
                                                </a>
                                                <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink1">

                                                    <div className="dte">
                                                        <input value="Date Range" type="text" />
                                                        <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                                        <strong>Select date</strong>
                                                    </div>
                                                    <div className="dat_sl_sc">
                                                        <div className="sel_opn">
                                                            <label>State</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Lod Type</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Order Category</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Carrier</label>
                                                            <select><option>All</option></select>
                                                        </div>


                                                    </div>
                                                    <div class="btn_dv"><button class="btn btn-grn"><i class="fa fa-check" aria-hidden="true"></i> Apply</button><button class="btn btn-whi"><i class="fa fa-times" aria-hidden="true"></i> Reset</button></div>
                                                </div>


                                            </div>

                                            <div className="filt srce">
                                                <input type="text" placeholder="Search Order by Order #, Customer" value={searchText} onChange={changeSearchText} />
                                                <button className="btn fil-src_btn" onClick={() => clickSearch()}><i className="fa fa-search" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="table-listing-app">
                                            <div className="table-responsive">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "8%" }}>Order #
                                                            <div className="sorting_btn">
                                                                <button className="t1" onClick={() => orderByAsc("orderId")} hidden={sort.column === "orderId" && sort.type === "ASC"}>
                                                                    <img src="assets/images/sorting-btn1.jpg" />
                                                                </button>
                                                                <button className="t1" onClick={() => orderByDesc("orderId")} hidden={sort.column === "orderId" && sort.type === "DESC"}>
                                                                    <img src="assets/images/sorting-btn2.jpg" />
                                                                </button>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "7%" }}>Leg ID
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("legId")} hidden={sort.column === "legId" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("legId")} hidden={sort.column === "legId" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Customer
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("customerName")} hidden={sort.column === "customerName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("customerName")} hidden={sort.column === "customerName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "9.8%" }}>Order Date
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.8%" }}>Order Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Load Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("loadType")} hidden={sort.column === "loadType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("loadType")} hidden={sort.column === "loadType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.6%" }}>Total Bids
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "7.1%" }}>Status
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Assigned
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "9.1%" }}>Carrier #
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>$ Price
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("price")} hidden={sort.column === "price" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("price")} hidden={sort.column === "price" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>

                                                        <th style={{ width: "4%" }}>Action</th>
                                                    </tr>
                                                    {listData.length > 0 ? <React.Fragment>

                                                        {listData.map((data, i) => <React.Fragment key={i}>

                                                            <tr>
                                                                <td>{data.orderId}</td>
                                                                <td>{data.legId}</td>
                                                                <td>{data.Customer}</td>
                                                                <td>{SetScheduleDate(data.orderDate)}</td>
                                                                <td>{data.OrderType}</td>
                                                                <td>{data.loadType}</td>
                                                                <td>N/A</td>
                                                                {data.orderStatus == 0 ?
                                                                    <td className="yel_txt"><strong>Pending</strong></td> : <>
                                                                        {data.orderStatus == 1 ? <>
                                                                            <td className="sky_txt"><strong>Outgoing</strong></td>
                                                                        </> : <>
                                                                            {data.orderStatus == 2 ? <>
                                                                                <td className="red_txt"><strong>Cancelled</strong></td>
                                                                            </> : <>
                                                                                {data.orderStatus == 3 ? <>
                                                                                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                                                                                </> : <>
                                                                                    <td className="dgrn_txt"><strong>Completed</strong></td>
                                                                                </>}
                                                                            </>}
                                                                        </>}
                                                                    </>}
                                                                <td>N/A</td>
                                                                <td>N/A</td>
                                                                <td className="dgrn_txt">$ {data.price}</td>
                                                                <td>
                                                                    <div className="dropdown show">
                                                                        <a className="btn btn-secondary dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <img src="assets/images/three-dots.jpg" />
                                                                        </a>
                                                                        <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                            <ul>
                                                                                <li><a href="javascript:void(0)" onClick={() => goViewOrderDetails(data.id)}>View Details</a></li>
                                                                                <li><a href="javascript:void(0)" onClick={() => goEditOrderDetails(data.id)}>Edit</a></li>
                                                                                <li><a href="javascript:void(0)" >View Bids</a></li>
                                                                                <li><a href="javascript:void(0)" >Assign Carrier</a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr></React.Fragment>)}
                                                    </React.Fragment> : <React.Fragment>
                                                        <tr>
                                                            <td colSpan="12" >
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>}
                                                    {/* <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="sky_txt"><strong>Outgoing</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="red_txt"><strong>Cancelled</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="dgrn_txt"><strong>Completed</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
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
                                                                    <a href="#" aria-controls="dtBasicExample"
                                                                        data-dt-idx="1" tabindex="0" className="page-link">1</a></li>
                                                            </React.Fragment>)}
                                                        </> : <></>}
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

                                                    </ul>
                                                </div>
                                                <div className="dataTables_length bs-select" id="dtBasicExample_length">
                                                    <label>Show
                                                        <select name="dtBasicExample_length" aria-controls="dtBasicExample"
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
                                <div className="tab-pane" id="pastorder">

                                    <div className="tab-pane active" id="allorder">
                                        <div className="filtr_sc">
                                            <div className="dropdown show filt fil_b">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fa fa-filter" aria-hidden="true"></i> <strong>Filter</strong> <i className="fa fa-caret-down" aria-hidden="true"></i>
                                                </a>
                                                <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink1">

                                                    <div className="dte">
                                                        <input value="Date Range" type="text" />
                                                        <i className="fa fa-caret-down input-prefix active" aria-hidden="true"></i>
                                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                                        <strong>Select date</strong>
                                                    </div>
                                                    <div className="dat_sl_sc">
                                                        <div className="sel_opn">
                                                            <label>State</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Lod Type</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Order Category</label>
                                                            <select><option>All</option></select>
                                                        </div>
                                                        <div className="sel_opn">
                                                            <label>Carrier</label>
                                                            <select><option>All</option></select>
                                                        </div>


                                                    </div>
                                                    <div class="btn_dv"><button class="btn btn-grn"><i class="fa fa-check" aria-hidden="true"></i> Apply</button><button class="btn btn-whi"><i class="fa fa-times" aria-hidden="true"></i> Reset</button></div>
                                                </div>


                                            </div>

                                            <div className="filt srce">
                                                <input type="text" placeholder="Search Order by Order #, Customer" value={searchText} onChange={changeSearchText} />
                                                <button className="btn fil-src_btn" onClick={() => clickSearch()}><i className="fa fa-search" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="table-listing-app">
                                            <div className="table-responsive">
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "8%" }}>Order #
                                                            <div className="sorting_btn">
                                                                <button className="t1" onClick={() => orderByAsc("orderId")} hidden={sort.column === "orderId" && sort.type === "ASC"}>
                                                                    <img src="assets/images/sorting-btn1.jpg" />
                                                                </button>
                                                                <button className="t1" onClick={() => orderByDesc("orderId")} hidden={sort.column === "orderId" && sort.type === "DESC"}>
                                                                    <img src="assets/images/sorting-btn2.jpg" />
                                                                </button>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "7%" }}>Leg ID
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("legId")} hidden={sort.column === "legId" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("legId")} hidden={sort.column === "legId" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Customer
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("customerName")} hidden={sort.column === "customerName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("customerName")} hidden={sort.column === "customerName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "9.8%" }}>Order Date
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderDate")} hidden={sort.column === "orderDate" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.8%" }}>Order Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("OrderType")} hidden={sort.column === "OrderType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Load Type
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("loadType")} hidden={sort.column === "loadType" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("loadType")} hidden={sort.column === "loadType" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10.6%" }}>Total Bids
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "7.1%" }}>Status
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("orderStatus")} hidden={sort.column === "orderStatus" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>Assigned
                                                            {/* <div className="sorting_btn"> <button className="t1"><img
                            src="assets/images/sorting-btn1.jpg" /></button><button
                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div> */}
                                                        </th>
                                                        <th style={{ width: "9.1%" }}>Carrier #
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("carrierName")} hidden={sort.column === "carrierName" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>$ Price
                                                            <div className="sorting_btn"> <button className="t1" onClick={() => orderByAsc("price")} hidden={sort.column === "price" && sort.type === "ASC"}><img
                                                                src="assets/images/sorting-btn1.jpg" /></button><button
                                                                    className="t1" onClick={() => orderByDesc("price")} hidden={sort.column === "price" && sort.type === "DESC"}><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                        </th>

                                                        <th style={{ width: "4%" }}>Action</th>
                                                    </tr>
                                                    {listData.length > 0 ? <React.Fragment>

                                                        {listData.map((data, i) => <React.Fragment key={i}>

                                                            <tr>
                                                                <td>{data.orderId}</td>
                                                                <td>{data.legId}</td>
                                                                <td>{data.Customer}</td>
                                                                <td>{SetScheduleDate(data.orderDate)}</td>
                                                                <td>{data.OrderType}</td>
                                                                <td>{data.loadType}</td>
                                                                <td>N/A</td>
                                                                {data.orderStatus == 0 ?
                                                                    <td className="yel_txt"><strong>Pending</strong></td> : <>
                                                                        {data.orderStatus == 1 ? <>
                                                                            <td className="sky_txt"><strong>Outgoing</strong></td>
                                                                        </> : <>
                                                                            {data.orderStatus == 2 ? <>
                                                                                <td className="red_txt"><strong>Cancelled</strong></td>
                                                                            </> : <>
                                                                                {data.orderStatus == 3 ? <>
                                                                                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                                                                                </> : <>
                                                                                    <td className="dgrn_txt"><strong>Completed</strong></td>
                                                                                </>}
                                                                            </>}
                                                                        </>}
                                                                    </>}
                                                                <td>N/A</td>
                                                                <td>N/A</td>
                                                                <td className="dgrn_txt">$ {data.price}</td>
                                                                <td>
                                                                    <div className="dropdown show">
                                                                        <a className="btn btn-secondary dropdown-toggle" href="javascript:void(0)" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <img src="assets/images/three-dots.jpg" />
                                                                        </a>
                                                                        <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                                                            <ul>
                                                                                <li><a href="javascript:void(0)" onClick={() => goViewOrderDetails(data.id)}>View Details</a></li>
                                                                                <li><a href="javascript:void(0)" onClick={() => goEditOrderDetails(data.id)}>Edit</a></li>
                                                                                <li><a href="javascript:void(0)" >View Bids</a></li>
                                                                                <li><a href="javascript:void(0)" >Assign Carrier</a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr></React.Fragment>)}
                                                    </React.Fragment> : <React.Fragment>
                                                        <tr>
                                                            <td colSpan="12" >
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>}
                                                    {/* <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="sky_txt"><strong>Outgoing</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="red_txt"><strong>Cancelled</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="blu_txt"><strong>Partial Completion</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>1208</td>
                    <td>423 852</td>
                    <td>Norman Farrelly</td>
                    <td>10-10-2021</td>
                    <td>Local</td>
                    <td>Round Trip</td>
                    <td>1608</td>
                    <td className="dgrn_txt"><strong>Completed</strong></td>
                    <td>Susan Lucas</td>
                    <td>159 523</td>
                    <td className="dgrn_txt">$ 125,000</td>
                    <td>
                        <div className="dropdown show">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/three-dots.jpg" />
                            </a>
                            <div className="dropdown-menu tbl-drop-links rject" aria-labelledby="dropdownMenuLink1">
                                <ul>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Details</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Edit</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">View Bids</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#">Assign Carrier</a></li>
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
                                                                    <a href="#" aria-controls="dtBasicExample"
                                                                        data-dt-idx="1" tabindex="0" className="page-link">1</a></li>
                                                            </React.Fragment>)}
                                                        </> : <></>}
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

                                                    </ul>
                                                </div>
                                                <div className="dataTables_length bs-select" id="dtBasicExample_length">
                                                    <label>Show
                                                        <select name="dtBasicExample_length" aria-controls="dtBasicExample"
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
            </div>
        </>)
}