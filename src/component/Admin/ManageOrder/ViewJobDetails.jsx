import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLocalStorageData, SetDateFormat, SetScheduleDate } from "../../../services/commonFunction/commonFunction"
import { ErrorCode } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";

export default function ViewJobDetails(props) {
    const navigate = useHistory();
    consoleLog("peoeo", props.history.location.state);
    const [userId, setUserId] = useState("");
    const [jobDetails, setJobDetails] = useState({});
    useEffect(() => {
        if (props.history.location.state === undefined) {
            navigate.push("/orderManagement");
        } else {
            let authUser = getLocalStorageData();
            setUserId(authUser.data.userId);
            let obj = {
                id: props.history.location.state,
                userId: authUser.data.userId
            }
            getJobDetails(obj);
        }
    }, []);

    async function getJobDetails(obj) {
        let res = await ApiCall("orderDetails", obj);
        if (res.success === true && res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.response);
            // consoleLog("user List::", payload.data);
            setJobDetails(payload.data);

        }
        // else if (res.success === false) {
        //     if (res.status === ErrorCode.ERROR.ERROR_CODE.NO_DATA_FOUND) {
        //         setJobDetails([]);
        //     }
        // }

    }

    function goBackOrderList() {
        navigate.push("/orderManagement");
    }
    return (<>
        <div className="component-wrapper">
            <div className="page-head-section">
                <div className="hd_bk">

                    <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goBackOrderList()}></i>
                    <strong><span>Order Management</span>Job Details</strong>
                </div>

            </div>
            {Object.keys(jobDetails).length > 0 ?
                <div className="_fl prof-list-bx view-job-detail">
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Job Details</h3>
                        </div>
                    </div>
                    <div className="div_divdr">
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Order ID</strong>
                                            <span>{jobDetails.orderId}</span>
                                        </li>
                                        <li>
                                            <strong>Leg ID</strong>
                                            <span>{jobDetails.legId}</span>
                                        </li>
                                        <li>
                                            <strong>Order Type</strong>
                                            <span>{jobDetails.OrderType}</span>
                                        </li>
                                        <li>
                                            <strong>Load Type</strong>
                                            <span>{jobDetails.loadType}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Order Date/Time</strong>
                                            <span>{SetDateFormat(jobDetails.orderDate)}</span>
                                        </li>
                                        <li>
                                            <strong>Customer Name</strong>
                                            <span>{jobDetails.customerName}</span>
                                        </li>
                                        <li>
                                            <strong>Customer Reference</strong>
                                            <span>{jobDetails.customerRef}</span>
                                        </li>
                                        <li>
                                            <strong>Site/Region</strong>
                                            <span>{jobDetails.site}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="div_divdr wit_bor">
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>COO Status</strong>
                                            <span>{jobDetails.cooStatus}</span>
                                        </li>
                                        <li>
                                            <strong>Salesperson</strong>
                                            <span>{jobDetails.salesPerson}</span>
                                        </li>
                                        <li>
                                            <strong>Pick up Location</strong>
                                            <span>{jobDetails.pickUpLocation}</span>
                                        </li>
                                        <li>
                                            <strong>Sheduled Pick up Date/Time</strong>
                                            <span>{SetDateFormat(jobDetails.schedulePickTime)}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Delivery Location</strong>
                                            <span>{jobDetails.deliveryLocation}</span>
                                        </li>
                                        <li>
                                            <strong>Sheduled Delivery Date/Time</strong>
                                            <span>{SetDateFormat(jobDetails.deliveryDate)}</span>
                                        </li>
                                        <li>
                                            <strong>Broker</strong>
                                            <span>{jobDetails.broker}</span>
                                        </li>
                                        <li>
                                            <strong>Shipper</strong>
                                            <span>{jobDetails.shipper}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="div_divdr">
                        <h3>Consignment Details</h3>
                        <div className="row">
                            <div className="col-md-4 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Container Type</strong>
                                            <span>{jobDetails.containerType}</span>
                                        </li>
                                        <li>
                                            <strong>Container Pickup #</strong>
                                            <span>{jobDetails.containerPickup}</span>
                                        </li>
                                        <li>
                                            <strong>Release #</strong>
                                            <span>{jobDetails.consignmentRelease}</span>
                                        </li>
                                        <li>
                                            <strong>Qty</strong>
                                            <span>{jobDetails.qty}</span>
                                        </li>
                                        <li>
                                            <strong>Contents</strong>
                                            <span>{jobDetails.contents}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Item Reference #</strong>
                                            <span>{jobDetails.itemReference}</span>
                                        </li>
                                        <li>
                                            <strong>Weight</strong>
                                            <span>{jobDetails.consignmentLoad}</span>
                                        </li>
                                        <li>
                                            <strong>Load #</strong>
                                            <span>125449</span>
                                        </li>
                                        <li>
                                            <strong>Container Status</strong>
                                            <span>{jobDetails.containerStatus}</span>
                                        </li>
                                        <li>
                                            <strong>Consignor</strong>
                                            <span>{jobDetails.consignor}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Consignee</strong>
                                            <span>{jobDetails.consignee}</span>
                                        </li>
                                        <li>
                                            <strong>Chassis No.</strong>
                                            <span>{jobDetails.chassisNo}</span>
                                        </li>
                                        <li>
                                            <strong>Freight Type</strong>
                                            <span>{jobDetails.freightType}</span>
                                        </li>
                                        <li>
                                            <strong>Vessel/Voyage</strong>
                                            <span>{jobDetails.vessel}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div> : <></>}
        </div>
    </>)
}