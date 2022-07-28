import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { EXPORT_URL, IMAGE_URL } from "../../../../services/apiConfig/config";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  getLocalStorageData,
  SetScheduleDate,
} from "../../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";

const reqData = {
  limit: "",
  offset: "",
  userId: "",
  searchText: "",
  vehicleType: "",
  vehicleStatus: "",
  startDate: "",
  endDate: "",
};

function ManageVehicles() {

  let navigate = useHistory();


  const [listData, setListData] = useState([]);
  const [limit, setLimit] = useState("10");
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState("");
  const [total_page, setTotalPage] = useState("1");
  const [allPageNumber, setAllPageNumber] = useState([]);
  const [current_page, setCurrentPage] = useState("1");
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewUserId, setViewUserId] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    // consoleLog("onLoad::")
    let authUser = getLocalStorageData();
    setUserId(authUser.data.userId);
    // consoleLog("auth data::",authUser.data)

    let resData = {
      limit: limit,
      offset: offset.toString(),
      userId: authUser.data.userId,
    };
    let mainData = Object.assign(reqData, resData);
    listApi(mainData);
  };

  const listApi = async (data) => {
    // consoleLog("request data:::", data);
    let res = await ApiCall("vehicleListData", data);

    if (
      res.success === true &&
      res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.response);
      // consoleLog("response data:::", payload);
      let vehicleList = payload.data.data;
      // consoleLog("response data vehicle:::", vehicleList);
      let totalPage = Math.ceil(payload.data.tatalRecords / limit);
      // consoleLog("totalpage::",totalPage)
      if (vehicleList && vehicleList.length > 0) {
        setListData(vehicleList);
        setTotalPage(totalPage);
        setTotalRecords(payload.data.tatalRecords);

        let arr = [];
        for (let i = 1; i <= totalPage; i++) {
          arr.push(i);
        }
        setAllPageNumber(arr);
        // consoleLog("list data::",vehicleList)
      } else if (res.success === false) {
        if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
          setListData([]);
        }
      }
    }
  };
  useEffect(() => {
    let obj = {
      userId: userId,
      limit: limit,
      offset: ((current_page - 1) * Number(limit)).toString(),

    }
    let returnData = Object.assign(reqData, obj);
    listApi(returnData);
  }, [current_page, limit])

  function nextPage() {
    if (current_page < total_page) {
      setCurrentPage(Number(current_page) + 1);
    }
  }

  function previousPage() {
    if (current_page > 1) {
      setCurrentPage(Number(current_page) - 1);
    }
  }
  function changePage(page) {
    setCurrentPage(page);
  }
  function changePagination(e) {
    setLimit(e.target.value);
  }
  // ...........export function.............
  async function onExport() {
    let obj = {
      userId: userId
    }
    let res = await ApiCall("vehicleListExport", obj);
    if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.response);
      window.open(IMAGE_URL + payload.data.response.fileName)
      toast.success("Download successfullly");
    } else {
      toast.error("Error occured !!!");
    }
  }

  function deactivateVehicle(id) {
    setViewUserId(id);
    window.$('#deactivateModal').modal('show');
  }

  function closeDeactivateModal() {
    window.$('#deactivateModal').modal('hide');
  }
  // ...........Delete function.............
  async function onDelete(id) {
    let obj = {
      userId: userId,
      id: id
    }

    // consoleLog("Obj:", id)
    let res = await ApiCall("deleteVehicle", obj);
    if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      window.$('#deactivateModal').modal('hide');
      toast.success(AlertMessage.MESSAGE.VEHICLE.DELETE_SUCCESS);

      let resData = {
        limit: limit,
        offset: offset.toString(),
        userId: userId,
      };
      let mainData = Object.assign(reqData, resData);
      listApi(mainData);

    } else {
      toast.error("Error occured !!!");
    }
  }
  function onAdd() {
    navigate.push("/Vehicledetail")
  }
  function onEdit(data, index) {
    // navigate.push('/Vehicledetailedit',{params:data})
    navigate.push({
      pathname: '/Vehicledetailedit',
      // search: '?query=abc',
      state: {
        detail: data,
        isEdit: false
      }
    });
  }
  function onViewData(data, index) {
    // navigate.push('/Vehicledetailedit',{params:data})
    navigate.push({
      pathname: '/Vehicledetailedit',
      // search: '?query=abc',
      state: {
        detail: data,
        isEdit: true
      }
    });
  }

  return (
    <>
      <ToastContainer hideProgressBar theme="colored" position="top-center" />
      {/* <div className="wrapper">
        <Sidebar />
        <Header /> */}
      <div className="component-wrapper">
        <div className="page-head-section no_bor">
          <h1 className="text-uppercase">Manage Vehicles</h1>
          <div className="btn_dv exp_ad">
            <button className="btn edt_btn" onClick={() => onExport()}>
              <i className="fa fa-upload" aria-hidden="true"></i>Export
            </button>
            <button className="btn edt_btn" onClick={() => onAdd()}>
              <i class="fa fa-plus-circle" aria-hidden="true" ></i>Add Vehicle
            </button>
          </div>
        </div>
        <div className="listing-component-app">
          <div className="vendor-info _fl sdw">
            <h3 className="">List of Vehicles</h3>

            <div className="table-listing-app">
              <div className="table-responsive">
                <table
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <th style={{ width: "10%" }}>
                      Vehicle Type
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    <th style={{ width: "10%" }}>
                      Vehicle #
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    <th style={{ width: "12%" }}>
                      Vehicle Plate
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    <th style={{ width: "11%" }}>
                      Vehicle Owner
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    {/* <th style={{ width: "10%" }}>Assigned To
                                                <div className="sorting_btn"> <button className="t1"><img
                                                    src="assets/images/sorting-btn1.jpg" /></button><button
                                                        className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                            </th> */}

                    <th style={{ width: "12%" }}>
                      Reg. Expeires On
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    <th style={{ width: "8%" }}>
                      Status
                      <div className="sorting_btn">
                        {" "}
                        <button className="t1">
                          <img src="assets/images/sorting-btn1.jpg" />
                        </button>
                        <button className="t1">
                          <img src="assets/images/sorting-btn2.jpg" />
                        </button>
                      </div>
                    </th>
                    <th style={{ width: "6%" }}>Action</th>
                  </tr>
                  {listData.length > 0 ? (
                    <React.Fragment>
                      {listData.map((obj, key) => (
                        <React.Fragment key={key}>
                          <tr>
                            <td>{obj.vehicleTypeName}</td>
                            <td>{obj.vehicle}</td>
                            <td>{obj.vehicleNumberPlate}</td>
                            <td>{obj.vehicleOwnerName}</td>
                            {/* <td>Marcia M. Scott</td> */}
                            <td>
                              {SetScheduleDate(obj.registrationExpires)}
                            </td>
                            {obj.vehicleStatus === "0" ? (
                              <td className="red_txt">INACTIVATE</td>
                            ) : obj.vehicleStatus === "1" ? (
                              <td className="dgrn_txt">
                                ACTIVE <span>Company Owned</span>
                              </td>
                            ) : obj.vehicleStatus === "2" ? (
                              <td className="dgrn_txt">
                                ACTIVE <span>Other</span>
                              </td>
                            ) : (
                              <React.Fragment />
                            )}

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
                                  className="dropdown-menu tbl-drop-links"
                                  aria-labelledby="dropdownMenuLink1"
                                >
                                  <ul>
                                    <li>
                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => onViewData(obj, key)}
                                      >
                                        View Details
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        data-toggle="modal"
                                        data-target="#"
                                      >
                                        Assign
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="javascript:void(0)"
                                        //   data-toggle="modal"
                                        //   data-target="#"
                                        onClick={() => onEdit(obj, key)}
                                      >
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => deactivateVehicle(obj.id)}
                                      >
                                        Delete
                                      </a>
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
                        <td colSpan="7">No Data Found</td>
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
                  Showing <b>{((current_page - 1) * 10) + 1}</b> to <b>{Number((current_page - 1) * limit) + listData.length}</b> of <b>{totalRecords}</b> entries
                </div>

                <div
                  className="dataTables_paginate paging_simple_numbers"
                  id="dtBasicExample_paginate"
                >
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
                  >
                    <a
                      href="javascript:void(0)"
                      aria-controls="dtBasicExample"
                      data-dt-idx="0"
                      tabindex="0"
                      className="page-link"
                      onClick={() => previousPage()}
                    >
                      <img src="assets/images/left-arrow.png" />
                    </a>
                  </button>
                  <button
                    className="paginate_button page-item next"
                    id="dtBasicExample_next"
                  >
                    <a
                      href="javascript:void(0)"
                      aria-controls="dtBasicExample"
                      data-dt-idx="7"
                      tabindex="0"
                      className="page-link"
                      onClick={() => nextPage()}
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
      {/* </div> */}
      {/*<!-- Modal sure activate-->*/}
      <div className="modal fade" id="deactivateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel4"
        aria-hidden="true">
        <div className="modal-dialog usr_dtls" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="sure_act">
                <strong>Are you sure?</strong>
                <p>Do you really want to delete this vehicle?</p>
                {/* <p>you can always change the user status anytime</p> */}

              </div>
              <div className="btn_dv de_act">
                <button className="btn btn-red" onClick={() => onDelete(viewUserId)}>Delete</button>
                <button className="btn btn-whi" onClick={() => closeDeactivateModal()}>Cancel</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ManageVehicles;
