import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../../../../services/apiConfig/config";
import { Decoder } from "../../../../services/auth";
import { consoleLog, getLocalStorageData, SetDOBDate, SetScheduleDate } from "../../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { inputEmptyValidate } from "../../../../services/Validator/Validator";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";



function VehicleDetailsEdit() {
  var myparam = useLocation();
  var navigate = useHistory();

  const [preData, setPreData] = useState({});
  const [editId, setEditId] = useState("");
  const [userId, setUserId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [vin, setVin] = useState("");

  const [vehicleTypeArr, setVehicleTypeArr] = useState([]);
  const [makeArr, setMakeArr] = useState([]);
  const [modelArr, setModelArr] = useState([]);
  const [yearArr, setYearArr] = useState([]);
  const [vehicleOwnerArr, setVehicleOwnerArr] = useState([]);
  const [vehicleStatusArr, setVehicleStatusArr] = useState([]);
  const [vehicleTypeId, setVehicleTypeId] = useState("");
  const [vehicleTypeName, setVehicleTypeName] = useState("");
  const [vehicleTypeObj, setVehicleTypeObj] = useState({});
  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [vehicleOwnerName, setVehicleOwnerName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [statusId, setStatusId] = useState("");
  const [startingKM, setStarttingKm] = useState("");
  const [vehicleHistory, setVehicleHistory] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [docPath, setDocPath] = useState("");
  const [imageArr, setImageArr] = useState([]);
  const [imageDataArr, setImageDataArr] = useState([]);
  const [docArr, setDocArr] = useState([]);
  const [imageName, setImageName] = useState("");

  const [fileData, setFileData] = useState({});
  const [isEdit, setIsEdit] = useState(true);




  useEffect(() => {

    let authUser = getLocalStorageData();
    setUserId(authUser.data.userId);
    onLoad();
  }, [])

  async function onLoad() {

    window.scrollTo(0, 0);

    // consoleLog("param",myparam);
    setIsEdit(myparam.state.isEdit);
    var preMainData = myparam.state.detail;
    setPreData(preMainData)
    consoleLog("preData", preMainData)

    // ..........
    fetchData(preMainData.id)



    //   let authUser = getLocalStorageData();
    //   setUserId(authUser.data.userId);
    // ...........
    let vehicleTypeArr = [];

    let vehicleData = await allVehicleData();

    // consoleLog("vehicleData::", vehicleData);

    //    ............vehicle type .......

    vehicleData.vehicleType.map((obj) => {
      vehicleTypeArr.push({
        label: obj.name,
        value: obj.id,
      });
    });
    setVehicleTypeArr(vehicleTypeArr);

    // .............make type .........

    setMakeArr(vehicleData.vehicleMake);
    // .............model type .........

    setModelArr(vehicleData.vehicleModel);
    // .............year .........
    let yearArr = [];
    for (let i = 1950; i <= 2050; i++) {
      yearArr.push({
        id: i,
        name: i,
      });
    }
    setYearArr(yearArr);

    // .............vehicle owner,,,,,,,,,,,,,,,,,,,
    setVehicleOwnerArr(vehicleData.vehicleOwner);

    // ..........vehicle status,,,,,,,,,,,,,
    let statusArr = [
      {
        id: "0",
        label: "Inactive",
        status: false,
      },
      {
        id: "1",
        label: "Active-Company Owned",
        status: false,
      },
      {
        id: "2",
        label: "Active-Others",
        status: false,
      },
    ];
    setVehicleStatusArr(statusArr);
  }

  async function fetchData(data) {
    let authUser = getLocalStorageData();
    setUserId(authUser.data.userId);
    let obj = {
      "userId": authUser.data.userId,
      "id": data.toString()
    }
    let res = await ApiCall("fetchVehicleData", obj);
    if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.response);
      let vehicleData = payload.data;
      // consoleLog("fetch vehicle data::",payload.data)
      setEditId(vehicleData.id);
      setVehicleId(vehicleData.vehicle);
      setNumberPlate(vehicleData.vehicleNumberPlate);
      setVin(vehicleData.vin);
      let vehicleTypeArr = [];
      let vehicleArrData = await allVehicleData();
      vehicleArrData.vehicleType.map((obj) => {
        vehicleTypeArr.push({
          label: obj.name,
          value: obj.id,
        });
        if (vehicleData.vehicleTypeName == obj.name) {
          setVehicleTypeId(obj.id)
          setVehicleTypeName(obj.name)
        }
      })

      setVehicleTypeArr(vehicleTypeArr);
      // ................make dropdown,,,,,
      vehicleArrData.vehicleMake.map((obj) => {
        if (vehicleData.vehicleMakeName == obj.name) {
          setMakeId(obj.id)
        }
      })
      vehicleArrData.vehicleModel.map((obj) => {
        if (vehicleData.vehicleName == obj.name) {
          setModelId(obj.id)
        }
      })

      // .............year .........
      let yearArr = [];
      for (let i = 1950; i <= 2050; i++) {
        yearArr.push({
          id: i,
          name: i,
        });
        if (vehicleData.vehicleYear == i) {
          setYear(i)
        }
      }
      setYearArr(yearArr);

      //   ..........owner,,,,,,,,,,,,,,
      vehicleArrData.vehicleOwner.map((obj) => {
        if (vehicleData.vehicleOwnerName == obj.name) {
          setVehicleOwnerName(obj.id)
        }
      })
      //   ..........status,,,,,,,,,,,,,,
      let statusArr = [
        {
          id: "0",
          label: "Inactive",
          status: false,
        },
        {
          id: "1",
          label: "Active-Company Owned",
          status: false,
        },
        {
          id: "2",
          label: "Active-Others",
          status: false,
        },
      ];

      statusArr.map((obj) => {
        if (vehicleData.vehicleStatus = obj.id) {
          setStatusId(obj.id)
        }
      })

      setVehicleStatusArr(statusArr);


      //   .....date............
      setExpireDate(SetDOBDate(vehicleData.registrationExpires))
      //    ............km,,,,,,,,,,
      setStarttingKm(vehicleData.startingKm)

      // .....................imageArr,,,,,,,,,,,,,,,,,,,,,,,,
      if (vehicleData.vehicleImages !== "") {
        let img = vehicleData.vehicleImages.split(",");
        let dataArr = [];
        img.map((im) => {
          let imgname = im.substr(8);
          dataArr.push({
            "docName": imgname,
            "docAliseName": im,
            "docType": "11"
          })
        });

        setImageArr(img);
        setImageDataArr([...dataArr]);
      }
      // .....................Document Arr,,,,,,,,,,,,,,,,,,,,,,,,
      if (vehicleData.vehicleDoc.length > 0) {
        setDocArr(vehicleData.vehicleDoc);
      }

    }

  }

  // .............functionsss,,,,,,,,,,,,
  // ........vehicleType dropdown function................
  function vehicleTypeChange(e) {
    // console.log("vehicleTypeId", e.target.value);
    setVehicleTypeId(e.target.value);
  }
  // ...............make dropdown function...............
  function makeChange(e) {
    // console.log("make", e.target.value);
    setMakeId(e.target.value);
  }
  // ...............model dropdown function...............
  function modelChange(e) {
    // console.log("make", e.target.value);
    setModelId(e.target.value);
  }

  // ...............year dropdown function...............
  function yearChange(e) {
    console.log("make year", e.target.value);
    setYear(e.target.value);
  }
  // ..............vehicle owner,,,,,,,,,,,,,,,,,,,

  function ownerChange(e) {
    // console.log("make", e.target.value);
    setVehicleOwnerName(e.target.value);
  }
  // ,,,,,,,,,,,,,,,status,,,,,,,,,,,,,,,,,,,
  function statusChange(e) {
    // console.log("make", e.target.value);
    setStatusId(e.target.value);
  }
  // ,,,,,,,,,,,,,,,starting km,,,,,,,,,,,,,,,,,,,
  function kmChange(e) {
    // console.log("make", e.target.value);
    setStarttingKm(e.target.value);
  }
  function historyChange(e) {
    // console.log("make", e.target.value);
    setVehicleHistory(e.target.value);
  }



  async function imageChange(e) {
    const formData = new FormData();
    // consoleLog("eeeee",e.target.files[0])

    setImageName(e.target.files[0].name);
    [...e.target.files].forEach(file => {

      // consoleLog("picture::",file)
      setFileData(file)
      formData.append("file", file);
      axios.post(BASE_URL + "v1/imageupload", formData).then((res) => {
        if (res.data.success === true && res.data.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
          let payload = Decoder.decode(res.data.response);
          // consoleLog("file::",payload.data)
          setImagePath(payload.data.fileName);
          setImageName(payload.data.orgfilename);
          let arr = imageArr;
          let dataArr = imageDataArr;
          dataArr.push({
            "docName": payload.data.orgfilename,
            "docAliseName": payload.data.fileName,
            "docType": "11"
          })
          arr.push(payload.data.fileName)

          setImageArr(arr);
          setImageDataArr([...dataArr]);

          consoleLog("imgarr", arr)
          //   consoleLog("imgdataarr",arr)
        }
      });

    })
  }
  async function docChange(e) {
    const formData = new FormData();
    [...e.target.files].forEach(file => {
      formData.append("file", file);
      axios.post(BASE_URL + "v1/imageupload", formData).then((res) => {
        if (res.data.success === true && res.data.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
          let payload = Decoder.decode(res.data.response);
          // consoleLog("file::",payload.data)
          setDocPath(payload.data.fileName);
          let arr = docArr;
          arr.push({
            "docName": payload.data.orgfilename,
            "docAliseName": payload.data.fileName,
            "docType": "11"
          })
          // arr.push(payload.data.fileName)
          setDocArr([...arr]);
          // consoleLog("imgarr",docArr)
        }
      });
    })

  }

  // ,,,,,,,,,,,,,,,vehicle id,,,,,,,,,,,,,,,,,,,
  function vehicleIdChange(e) {
    // console.log("id", e.target.value);
    setVehicleId(e.target.value);
  }

  function numberPlateChange(e) {
    // console.log("id", e.target.value);
    setNumberPlate(e.target.value);
  }
  function vinChange(e) {
    // console.log("id", e.target.value);
    setVin(e.target.value);
  }

  async function allVehicleData() {
    let res = await ApiCall("allVehicle");
    // consoleLog("response:::", res);
    if (
      res.success === true &&
      res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.response);
      //   consoleLog("payload response:::", payload);
      return payload.data;
    }
  }

  function onDateChange(e) {
    consoleLog("date::::", e.target.value);
    setExpireDate(e.target.value);
  }

  async function onSave() {
    window.scrollTo(0, 0);
    let errorCount = 0;

    let validateVehicleId = inputEmptyValidate(vehicleId),
      validateNumberPlate = inputEmptyValidate(numberPlate),
      validateVin = inputEmptyValidate(vin),
      validateVehicleType = inputEmptyValidate(vehicleTypeId),
      validateMake = inputEmptyValidate(makeId),
      validateModel = inputEmptyValidate(modelId),
      validateYear = inputEmptyValidate(year),
      validateExpireDate = inputEmptyValidate(expireDate),
      validateOwner = inputEmptyValidate(vehicleOwnerName),
      validateStatus = inputEmptyValidate(statusId),
      validateStartingKm = inputEmptyValidate(startingKM),
      validateImage = inputEmptyValidate(imageArr),
      validateDoc = inputEmptyValidate(docArr);

    consoleLog("valid::", validateVehicleId)

    if (validateVehicleId === false) {
      consoleLog("valid::", validateVehicleId)
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_VEHICLE_ID);
      errorCount++;
    } else if (validateNumberPlate === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_NUMBER_PLATE);
      errorCount++;
    }
    else if (validateVin === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_VIN);
      errorCount++;
    } else if (validateVehicleType === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_VEHICLE_TYPE);
      errorCount++;
    } else if (validateMake === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_MAKE);
      errorCount++;
    } else if (validateModel === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_MODEL);
      errorCount++;
    } else if (validateYear === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_YEAR);
      errorCount++;
    } else if (validateExpireDate === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_EXPIRE_DATE);
      errorCount++;
    } else if (validateOwner === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_OWNER);
      errorCount++;
    } else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_STATUS);
      errorCount++;
    } else if (validateStartingKm === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_KM);
      errorCount++;
    } else if (validateImage === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_IMAGE);
      errorCount++;
    } else if (validateDoc === false) {
      toast.error(AlertMessage.MESSAGE.VEHICLE.EMPTY_DOC);
      errorCount++;
    }


    if (errorCount === 0) {
      let modImgArr = imageArr.join(",");
      // consoleLog("arrimage",modImgArr)
      let obj = {
        id: editId,
        userId: userId,
        "vehicle": vehicleId,
        "vehicleNumberPlate": numberPlate,
        "vin": vin,
        "vehicleType": vehicleTypeId,
        "vehicleMake": makeId,
        "vehicleModel": modelId,
        "vehicleYear": year,
        "registrationExpires": SetDOBDate(expireDate),
        "vehicleOwner": vehicleOwnerName,
        "vehicleStatus": statusId,
        "startingKm": startingKM,
        "vehicleImages": modImgArr,
        "inspectionDate": SetDOBDate(Date.now()),
        "documents": docArr
      }

      // consoleLog("req data:::", obj)

      let res = await ApiCall("updateVehicle", obj);
      if (
        res.success === true &&
        res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.VEHICLE.UPDATE_SUCCESS);
        window.scrollTo(0, 0);
        navigate.push("/Managevehicle");
      } else {
        toast.error("Error Occured !!")
      }

    }


  }

  function backToList() {
    navigate.push("/Managevehicle")
  }

  return (
    <>
      <ToastContainer hideProgressBar position="top-center" theme="colored" />
      {/* <div className="wrapper">
        <Sidebar />
        <Header /> */}
      <div className="component-wrapper">
        <div className="page-head-section">
          <div className="hd_bk">
            <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => backToList()}></i>
            <strong>
              <span>Dashboard</span>Edit Vehicle
            </strong>
          </div>
        </div>
        <div className="_fl dashboard-list">
          <div className="row">
            <div className="col-md-12">
              <h3>Edit Vehicle Details</h3>
              <div className="ppedit addnew_us pr1">
                <div className="vehicl_file">
                  <div className="edit_file_in">
                    <div className="ed_nm">
                      <label>Vehicle #</label>
                      <input
                        type="text"
                        value={vehicleId}
                        onChange={vehicleIdChange}
                        placeholder="Enter vehicle #"
                        readOnly
                      />
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Number Plate</label>
                      <input
                        type="text"
                        value={numberPlate}
                        onChange={numberPlateChange}
                        placeholder="Vehicle Number Plate"
                        readOnly={isEdit}
                      />
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>VIN</label>
                      <input
                        type="text"
                        value={vin}
                        onChange={vinChange}
                        placeholder="Enter VIN"
                        readOnly={isEdit}
                      />
                    </div>
                    <div className="ed_nm">
                      <label>Vehicle Type</label>
                      <select onChange={vehicleTypeChange} value={vehicleTypeId} disabled={isEdit}>
                        <option></option>
                        {vehicleTypeArr.map((obj, key) => (
                          <option value={obj.value} key={key}>
                            {obj.label}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Make</label>
                      <select onChange={makeChange} value={makeId} disabled={isEdit}>
                        <option></option>
                        {makeArr.map((obj, key) => (
                          <option value={obj.id} key={key}>
                            {obj.name}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Model</label>
                      <select onChange={modelChange} value={modelId} disabled={isEdit}>
                        <option></option>
                        {modelArr.map((obj, key) => (
                          <option value={obj.id} key={key}>
                            {obj.name}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Year</label>
                      <select onChange={yearChange} value={year} disabled={isEdit}>
                        <option></option>
                        {yearArr.map((obj, key) => (
                          <option value={obj.id} key={key}>
                            {obj.name}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Registration Expires On</label>
                      <input
                        type="date"
                        value={expireDate}
                        onChange={onDateChange}
                        readOnly={isEdit}
                      ></input>
                      <i class="fa fa-calendar" aria-hidden="true"></i>
                    </div>
                    <div className="ed_nm">
                      <label>Vehicle Owner</label>
                      <select onChange={ownerChange} value={vehicleOwnerName} disabled={isEdit}>
                        <option></option>
                        {vehicleOwnerArr.map((obj, key) => (
                          <option value={obj.id} key={key}>
                            {obj.name}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Assigned to</label>
                      <select disabled={isEdit}>
                        <option>Select</option>
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>Vehicle Status</label>
                      <select onChange={statusChange} value={statusId} disabled={isEdit}>
                        <option></option>
                        {vehicleStatusArr.map((obj, key) => (
                          <option value={obj.id} key={key}>
                            {obj.label}
                          </option>
                        ))}
                      </select>
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="ed_nm">
                      <label>
                        Starting Km <span>(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={startingKM}
                        onChange={kmChange}
                        placeholder="Enetr Starting km"
                        readOnly={isEdit}
                      />
                      <i className="fa fa-check" aria-hidden="true"></i>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="vehic_hist_dv addnew_us">
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <h3>Vehicle History</h3>
                <div className="ed_nm">
                  <label>Vehicle History</label>
                  <textarea
                    type="text"
                    value={vehicleHistory}
                    onChange={historyChange}
                    placeholder="Enter Vehicle history..."
                    readOnly={isEdit}
                  ></textarea>
                  <i className="fa fa-check" aria-hidden="true"></i>
                  <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <h3>Vehicle Image(s)</h3>
                <div className="ed_nm file_upl">
                  <label htmlFor="file-upload">
                    <input
                      type="file"
                      id="img"

                      onChange={(e) => imageChange(e)}
                      accept="image/*"
                      readOnly={isEdit}
                    />
                    <strong></strong>
                    <i class="fa fa-file-image-o" aria-hidden="true"></i>
                  </label>
                  <i className="fa fa-check" aria-hidden="true"></i>
                  <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                  <ul>
                    {/* {console.log("data html",imageDataArr)} */}
                    {imageDataArr.map((obj) => (
                      <li>
                        <div class="li-success" role="alert">
                          <i class="fa fa-info-circle" aria-hidden="true"></i>
                          <i class="fa fa-check" aria-hidden="true"></i>
                          {obj.docName}
                          <button>
                            <i class="fa fa-times" aria-hidden="true"></i>
                          </button>
                        </div>
                      </li>
                    ))}


                    {/* <li>
                            <div class="li-success" role="alert">
                              <i class="fa fa-info-circle" aria-hidden="true"></i>
                              <i class="fa fa-check" aria-hidden="true"></i>
                              imagename.jpg
                              <button>
                                <i class="fa fa-times" aria-hidden="true"></i>
                              </button>
                            </div>
                          </li>
                          <li>
                            <div class="li-danger" role="alert">
                              <i class="fa fa-info-circle" aria-hidden="true"></i>
                              <i class="fa fa-check" aria-hidden="true"></i>
                              imagename.tft
                              <button>
                                <i class="fa fa-times" aria-hidden="true"></i>
                              </button>
                            </div>{" "}
                            <p>
                              Unknown document format. Please upload
                              PDF,jpeg,jpg,png Only
                            </p>
                          </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <h3>Vehicle Document</h3>
                <div className="ed_nm file_upl">
                  <label>
                    <input type="file" onChange={(e) => docChange(e)}
                      readOnly={isEdit} />
                    <strong>Choose file...</strong>
                    <i class="fa fa-paperclip" aria-hidden="true"></i>
                  </label>
                  <i className="fa fa-check" aria-hidden="true"></i>
                  <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                  <ul>
                    {docArr.map((obj) => (
                      <li>
                        <div class="li-success" role="alert">
                          <i class="fa fa-info-circle" aria-hidden="true"></i>
                          <i class="fa fa-check" aria-hidden="true"></i>
                          {[obj.docName]}
                          <button>
                            <i class="fa fa-times" aria-hidden="true"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                    {/* <li>
                            <div class="li-success" role="alert">
                              <i class="fa fa-info-circle" aria-hidden="true"></i>
                              <i class="fa fa-check" aria-hidden="true"></i>
                              imagename.jpg
                              <button>
                                <i class="fa fa-times" aria-hidden="true"></i>
                              </button>
                            </div>
                          </li>
                          <li>
                            <div class="li-danger" role="alert">
                              <i class="fa fa-info-circle" aria-hidden="true"></i>
                              <i class="fa fa-check" aria-hidden="true"></i>
                              imagename.tft
                              <button>
                                <i class="fa fa-times" aria-hidden="true"></i>
                              </button>
                            </div>{" "}
                            <p>
                              Unknown document format. Please upload
                              PDF,jpeg,jpg,png Only
                            </p>
                          </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p>&nbsp;</p>
          {isEdit ?
            <div className="btn_dv">
              <button className="btn btn-whi" onClick={() => backToList()}>
                <i className="fa fa-times" aria-hidden="true"></i> Back
              </button>
            </div> :
            <div className="btn_dv">
              <button className="btn btn-grn" onClick={onSave}>
                <i className="fa fa-check" aria-hidden="true"></i> Save
              </button>
              <button className="btn btn-whi" onClick={() => backToList()}>
                <i className="fa fa-times" aria-hidden="true"></i> Cancel
              </button>
            </div>
          }
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default VehicleDetailsEdit;