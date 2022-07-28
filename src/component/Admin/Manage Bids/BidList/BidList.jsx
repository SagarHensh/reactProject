import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  getLandingDataFromAPI,
  getLocalStorageData,
  SetScheduleDate,
} from "../../../../services/commonFunction/commonFunction";
import { ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";

const reqData = {
  limit: "10",
  offset: "",
  userId: "",
  searchText: "",
  status: "",
  startDate: "",
  endDate: "",
  sort: {
    column: "",
    type: "",
  },
};

export default function BidList() {
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
    type: "",
  });

  function viewDetails() {
    navigate.push("/viewBidDetails");
  }

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
    };
    let reqObj = Object.assign(reqData, obj);
    getListData(reqObj);
  }, [limit, currPage]);

  async function getListData(obj) {
    // consoleLog("req:::", obj);
    let res = await ApiCall("bidList", obj);
    if (
      res.success === true &&
      res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
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

  function orderByDesc(data) {
    let filter = "";
    if (data === "orderId") {
      filter = "orderId";
    } else if (data === "legId") {
      filter = "legId";
    } else if (data === "carrierName") {
      filter = "carrierName";
    } else if (data === "postedOn") {
      filter = "postedOn";
    } else if (data === "respondedOn") {
      filter = "respondedOn";
    } else if (data === "status") {
      filter = "status";
    }
    setSort({
      column: filter,
      type: "DESC",
    });
    let obj = {
      userId: userId,
      limit: limit,
      offset: ((currPage - 1) * Number(limit)).toString(),
      searchText: searchText,
      sort: {
        column: filter,
        type: "DESC",
      },
    };
    let mainRequest = Object.assign(reqData, obj);
    getListData(mainRequest);
  }

  function orderByAsc(data) {
    let filter = "";
    if (data === "orderId") {
      filter = "orderId";
    } else if (data === "legId") {
      filter = "legId";
    } else if (data === "carrierName") {
      filter = "carrierName";
    } else if (data === "postedOn") {
      filter = "postedOn";
    } else if (data === "respondedOn") {
      filter = "respondedOn";
    } else if (data === "status") {
      filter = "status";
    }
    setSort({
      column: filter,
      type: "ASC",
    });
    let obj = {
      userId: userId,
      limit: limit,
      offset: ((currPage - 1) * Number(limit)).toString(),
      searchText: searchText,
      sort: {
        column: filter,
        type: "ASC",
      },
    };
    let mainRequest = Object.assign(reqData, obj);
    getListData(mainRequest);
  }

  function changePagination(e) {
    setLimit(e.target.value);
  }
  useEffect(() => {
    let obj = {
      userId: userId,
      limit: limit,
      offset: ((currPage - 1) * Number(limit)).toString(),
      searchText: searchText,
      sort: {
        column: "",
        type: "",
      },
    }
    let mainRequest = Object.assign(reqData, obj);
    getListData(mainRequest);

  }, [limit, currPage]);

  function changePage(page) {
    setCurrPage(page);
  }

  function nextPage() {
    consoleLog("next")
    if (currPage < totalPage) {
      setCurrPage(Number(currPage) + 1);
    }
  }

  function previousPage() {
    if (currPage > 1) {
      setCurrPage(Number(currPage) - 1);
    }
  }

  async function acceptBidRequest(id) {
    consoleLog("List Data::", listData[id])
    let obj = {
      userId: userId,
      orderId: listData[id].orderId,
      carrierId: listData[id].carrierId,
      bidId: listData[id].id,
      parentId: ""

    }
    let res = await ApiCall("acceptBid", obj);
    if (
      res.success === true &&
      res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success("Bid accepted successfully");
      let objreq = {
        userId: userId,
        limit: limit,
        offset: ((currPage - 1) * limit).toString(),
      };
      let reqObj = Object.assign(reqData, objreq);
      getListData(reqObj);

    }
  }

  return (
    <>
      <ToastContainer hideProgressBar theme="colored" position="top-center" />
      <div className="component-wrapper">
        <div className="page-head-section no_bor">
          <h1 className="text-uppercase">Manage Bids</h1>
        </div>
        <div className="listing-component-app">
          <div className="vendor-info _fl sdw">
            <h3>Manage Bids/ Response</h3>
            <div className="new_rqst_tab order_management">
              <div className="filtr_sc">
                <div className="dropdown show filt fil_b">
                  <a
                    className="btn btn-secondary"
                    data-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                    <strong>Filter</strong>{" "}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                  </a>

                  <div
                    id="collapseExample"
                    className="collapse tbl-drop-links"
                    aria-labelledby="dropdownMenuLink1"
                  >
                    <div class="card card-body">
                      <div className="dte">
                        <input value="Date Range" type="text" />
                        <i
                          className="fa fa-caret-down input-prefix active"
                          aria-hidden="true"
                        ></i>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                        <strong>Select date</strong>
                      </div>
                      <div className="dat_sl_sc">
                        <div className="sel_opn">
                          <label>State</label>
                          <select>
                            <option>All</option>
                          </select>
                        </div>
                        <div className="sel_opn">
                          <label>Load Type</label>
                          <select>
                            <option>All</option>
                          </select>
                        </div>
                        <div className="sel_opn">
                          <label>Order Category</label>
                          <select>
                            <option>All</option>
                          </select>
                        </div>
                        <div className="sel_opn">
                          <label>Carrier</label>
                          <select>
                            <option>All</option>
                          </select>
                        </div>
                      </div>
                      <div class="btn_dv">
                        <button class="btn btn-grn">
                          <i class="fa fa-check" aria-hidden="true"></i> Apply
                        </button>
                        <button class="btn btn-whi">
                          <i class="fa fa-times" aria-hidden="true"></i> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="filt srce">
                  <input type="text" placeholder="Search order..." />
                  <button className="btn fil-src_btn">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th style={{ width: "8%" }}>
                        Order #
                        <div className="sorting_btn">
                          {" "}
                          <button
                            className="t1"
                            onClick={() => orderByAsc("orderId")}
                            hidden={
                              sort.column === "orderId" && sort.type === "ASC"
                            }
                          >
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button
                            className="t1"
                            onClick={() => orderByDesc("orderId")}
                            hidden={
                              sort.column === "orderId" && sort.type === "DESC"
                            }
                          >
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div>
                      </th>
                      <th style={{ width: "7%" }}>
                        Leg ID
                        <div className="sorting_btn">
                          {" "}
                          <button
                            className="t1"
                            onClick={() => orderByAsc("legId")}
                            hidden={
                              sort.column === "legId" && sort.type === "ASC"
                            }
                          >
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button
                            className="t1"
                            onClick={() => orderByDesc("legId")}
                            hidden={
                              sort.column === "legId" && sort.type === "DESC"
                            }
                          >
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div>
                      </th>
                      <th style={{ width: "10%" }}>
                        Customer Name
                        {/* <div className="sorting_btn">
                          {" "}
                          <button className="t1">
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button className="t1">
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div> */}
                      </th>

                      <th style={{ width: "10%" }}>
                        Carrier #
                        {/* <div className="sorting_btn">
                          {" "}
                          <button className="t1">
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button className="t1">
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div> */}
                      </th>
                      <th style={{ width: "9.8%" }}>
                        Post On
                        <div className="sorting_btn">
                          {" "}
                          <button
                            className="t1"
                            onClick={() => orderByAsc("postedOn")}
                            hidden={
                              sort.column === "postedOn" && sort.type === "ASC"
                            }
                          >
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button
                            className="t1"
                            onClick={() => orderByDesc("postedOn")}
                            hidden={
                              sort.column === "postedOn" && sort.type === "DESC"
                            }
                          >
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div>
                      </th>
                      <th style={{ width: "9.8%" }}>
                        Response On
                        <div className="sorting_btn">
                          {" "}
                          <button className="t1" onClick={() => orderByAsc("respondedOn")}
                            hidden={
                              sort.column === "respondedOn" && sort.type === "ASC"
                            }>
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button className="t1" onClick={() => orderByDesc("respondedOn")}
                            hidden={
                              sort.column === "respondedOn" && sort.type === "DESC"
                            }>
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div>
                      </th>

                      <th style={{ width: "7.1%" }}>
                        Bid Status
                        {/* <div className="sorting_btn">
                          {" "}
                          <button className="t1">
                            <img src="assets/images/sorting-btn1.jpg" />
                          </button>
                          <button className="t1">
                            <img src="assets/images/sorting-btn2.jpg" />
                          </button>
                        </div> */}
                      </th>

                      <th style={{ width: "4%" }}>Action</th>
                    </tr>
                    {listData.length > 0 ? (
                      <React.Fragment>
                        {listData.map((obj, key) => (
                          <React.Fragment key={key}>
                            <tr>
                              <td>{obj.orderIdTrini}</td>
                              <td>{obj.legId}</td>
                              <td>Norman Farrelly</td>
                              <td>{obj.carrierName}</td>
                              <td>{SetScheduleDate(obj.postedOn)}</td>
                              <td>
                                {obj.respondedOn == null
                                  ? "N/A"
                                  : obj.respondedOn}
                              </td>
                              {obj.status == 5 ?
                                <td className="yel_txt">
                                  <strong>AWAITING</strong>
                                </td> : <>
                                  {obj.status == 1 ?
                                    <td className="dgrn_txt">
                                      <strong>ACCEPTED</strong>
                                    </td> : <>
                                      {obj.status == 2 ?
                                        <td className="red_txt">
                                          <strong>REJECTED</strong>
                                        </td> : <>
                                          {obj.status == 3 ?
                                            <td className="sky_txt">
                                              <strong>RENEGOTIATED</strong>
                                            </td> : <>
                                              {obj.status == 4 ?
                                                <td className="blu_txt">
                                                  <strong>RESPONDED</strong>
                                                </td> : <></>}
                                            </>}
                                        </>}
                                    </>}
                                </>}
                              <td>
                                <div className="dropdown show">
                                  <a
                                    className="btn btn-secondary dropdown-toggle"
                                    href="#"
                                    role="button"
                                    id="dropdownMenuLink1"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <img src="assets/images/three-dots.jpg" />
                                  </a>
                                  <div
                                    className="dropdown-menu tbl-drop-links rject"
                                    aria-labelledby="dropdownMenuLink1"
                                  >
                                    <ul>
                                      <li>
                                        <a
                                          href="javascript:void(0)"
                                          onClick={() => viewDetails()}
                                        >
                                          View Details
                                        </a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0)"
                                          onClick={() => acceptBidRequest(key)}
                                        >Accept</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0)">Reject</a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <tr>
                          <td colSpan="8">No Data Found</td>
                        </tr>
                      </React.Fragment>
                    )}
                  </table>
                </div>
                <div className="peg_blo">
                  <div
                    className="dataTables_info"
                    id="dtBasicExample_info"
                    role="status"
                    aria-live="polite"
                  >
                    Showing <b>{(currPage - 1) * limit + 1}</b> to <b>{Number((currPage - 1) * limit) + listData.length}</b> of <b>{totalRecords}</b> entries
                  </div>

                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="dtBasicExample_paginate"
                  >
                    <ul className="pagination">
                      <li className="paginate_button page-item ">
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
                      </li>

                    </ul>
                  </div>
                  <div
                    className="dataTables_length bs-select"
                    id="dtBasicExample_length"
                  >
                    <label>
                      Show{" "}
                      <select
                        name="dtBasicExample_length"
                        aria-controls="dtBasicExample"
                        className="custom-select custom-select-sm form-control form-control-sm"
                        value={limit} onChange={changePagination}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>{" "}
                      rows
                    </label>
                  </div>
                  <div className="pag_btn">
                    <button
                      className="paginate_button page-item previous"
                      id="dtBasicExample_previous"
                      onClick={() => previousPage()}
                    >
                      <a
                        href="#"
                        aria-controls="dtBasicExample"
                        data-dt-idx="0"
                        tabindex="0"
                        className="page-link"
                      >
                        <img src="assets/images/left-arrow.png" />
                      </a>
                    </button>
                    <button
                      className="paginate_button page-item next"
                      id="dtBasicExample_next"
                      onClick={() => nextPage()}
                    >
                      <a
                        href="#"
                        aria-controls="dtBasicExample"
                        data-dt-idx="7"
                        tabindex="0"
                        className="page-link"
                      >
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
    </>
  );
}
