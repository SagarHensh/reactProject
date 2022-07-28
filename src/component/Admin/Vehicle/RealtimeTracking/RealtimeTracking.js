import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Decoder } from "../../../../services/auth";
import { consoleLog, getLandingDataFromAPI, getLocalStorageData } from "../../../../services/commonFunction/commonFunction";
import { AlertMessage, ErrorCode, UsersEnums } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import GoogleMapsReact from "./GoogleMapsReact";

function RealtimeTracking() {

    const [userId, setUserId] = useState("");
    const [listData, setListData] = useState([]);
    // const [landingData, setAllLandingData] = useState([]);
    const [carrierStatus, setCarrierStatus] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        onLoad();
    }, [])

    const onLoad = async () => {
        // consoleLog("onLoad::")
        let authUser = getLocalStorageData();
        setUserId(authUser.data.userId);
        // let data = await getLandingDataFromAPI();
        // setAllLandingData(data);
        // consoleLog("data::",data)

        let resData = {
            userId: authUser.data.userId,
            searchText: "",
            orderStatus: "",
            jobstatus: "",
            locationStatus: ""
        };
        listApi(resData);
    };

    const listApi = async (data) => {
        let res = await ApiCall("getCurrentLocationOfVehicle", data);

        if (
            res.success === true &&
            res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.response);
            consoleLog("response data:::", payload.data.data);
            let trackArr = [];
            trackArr = payload.data.data;
            if (trackArr.length > 0) {
                setListData(trackArr);
            } else {
                setListData([]);
                toast.error(AlertMessage.MESSAGE.CARRIER.NOT_FOUND);
            }

        } else if (res.success === false) {
            if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
                setListData([]);
            }
        }
    };

    function showMap() {
        return (
            <GoogleMapsReact value={listData} />
        )

    }

    useEffect(() => {
        // consoleLog("Hi set ListData", listData)
        showMap();
    }, listData);

    function carrierStatusChange(e) {
        setCarrierStatus(e.target.value);
    }

    function changeSearchText(e) {
        setSearchText(e.target.value)
    }

    function filterApply() {
        let resData = {
            userId: userId,
            searchText: searchText,
            orderStatus: carrierStatus,
            jobstatus: "",
            locationStatus: ""
        };
        listApi(resData);
    }

    return (
        <>
            <ToastContainer hideProgressBar theme="colored" position="top-center" />
            <div className="component-wrapper">
                <div className="page-head-section no_bor">
                    <h1 className="text-uppercase">Live Carrier Tracking</h1>

                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">
                        <div className="filtr_sc">
                            <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                            <div className="filt dt_dv">


                            </div>
                            <div className="filt stus crerty">Carrier Name or #</div>
                            <div className="filt srce">
                                <input type="text" placeholder="Enter Carrier Name  or #" value={searchText} onChange={changeSearchText} />

                            </div>
                            <div className="filt stus crerty">Status <select className="slec" onChange={carrierStatusChange}>
                                <option value="">All</option>
                                {UsersEnums.CARRIER_STATUS.length > 0 ? <React.Fragment>
                                    {UsersEnums.CARRIER_STATUS.map((data, i) => <React.Fragment key={i}>
                                        <option value={data.id}>{data.name}</option>
                                    </React.Fragment>)}
                                </React.Fragment> : <React.Fragment></React.Fragment>}
                            </select></div>



                            <div className="filt aply">
                                <button className="btn btn-aply" onClick={() => filterApply()}>Apply</button>
                            </div>

                        </div>
                        <div className="mape_sec">
                            {/* <img src="assets/images/map-image.png" /> */}
                            {showMap()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RealtimeTracking;