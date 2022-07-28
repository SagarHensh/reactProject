import { useState } from "react"
import { useHistory } from "react-router-dom";

export default function EditJobDetails() {
    let navigate = useHistory();
    const [userId, , setUserId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [legId, setLegid] = useState("");
    const [allOrderType, setAllOrderType] = useState([]);
    const [orderType, setOrderType] = useState("");
    const [loadTypeArr, setLoadTypeArr] = useState([]);
    const [loadtype, setLoadType] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerRef, setCustomerRef] = useState("");
    const [allSite, setAllSite] = useState([]);
    const [site, setSite] = useState("");
    const [cooStatus, setCooStatus] = useState("");
    const [allCooStatus, setAllCooStatus] = useState([]);
    const [allSalesPerson, setAllSalesPerson] = useState([]);
    const [salesPerson, setSalesPerson] = useState("");
    const [allPickupLocation, setAllPickupLocation] = useState([]);
    const [pickupLocation, setPickupLocation] = useState("");
    const [schedulePickupDate, setSchedulePickupDate] = useState("");
    const [allDeliveryLocation, setAllDeliveryLocation] = useState([]);
    const [deliveryLocation, setDeliveryLocation] = useState("");
    const [scheduleDeliveryDate, setScheduleDeliveryDate] = useState("");
    const [broker, setBroker] = useState("");
    const [shipper, setShipper] = useState("");

    function gotoOrderList() {
        navigate.push("/orderManagement");
    }
    return (
        <>
            <div className="component-wrapper">
                <div className="page-head-section">
                    <div className="hd_bk">

                        <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => gotoOrderList()}></i>
                        <strong><span>Order Management</span>Edit Job Details</strong>
                    </div>

                </div>
                <div className="_fl dashboard-list">
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Edit Job Details</h3>
                            <div className="ppedit addnew_us pr1">

                                <div className="vehicl_file">
                                    <div className="edit_file_in">
                                        <div className="ed_nm"><label>Order Id</label><input type="text" value=""
                                            placeholder="123456" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            <p>Order ID can't be change </p></div>
                                        <div className="ed_nm"><label>Leg ID</label><input type="text" value=""
                                            placeholder="0987654" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                            <p>Leg ID can't be change </p></div>
                                        <div className="ed_nm res_dis_no"></div>
                                        <div className="ed_nm"><label>Order Type</label>

                                            <select>
                                                <option>
                                                    Local
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm"><label>Load Type</label>
                                            <select>
                                                <option>
                                                    Load Type
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>
                                        <div className="ed_nm"><label>Order Date/Time</label>
                                            <input type="text" className="form-control" id="datetimepicker1" placeholder="26-04-2022" />
                                            <i class="fa fa-calendar" aria-hidden="true"></i>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>

                                        <div className="ed_nm"><label>Customer Name</label><input type="text" value=""
                                            placeholder="Charles C. Smith" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>

                                        </div>
                                        <div className="ed_nm"><label>Customer Reference</label><input type="text" value=""
                                            placeholder="Charles C. Smith" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>

                                        </div>

                                        <div className="ed_nm"><label>Site/Region</label>
                                            <select>
                                                <option>
                                                    NY
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>

                                        <div className="ed_nm"><label>COO Status</label>
                                            <select>
                                                <option>
                                                    Pending
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>
                                        <div className="ed_nm"><label>Salesperson</label>
                                            <select>
                                                <option>
                                                    Charles C. Smith
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>

                                        <div className="ed_nm"><label>Pick up Location</label>
                                            <select>
                                                <option>
                                                    LA
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>

                                        <div className="ed_nm"><label>Sheduled Pick up Date/Time</label>
                                            <input type="text" className="form-control" id="datetimepicker2" placeholder="26-04-2022" />
                                            <i class="fa fa-calendar" aria-hidden="true"></i>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm"><label>Delivery Location</label>
                                            <select>
                                                <option>
                                                    NY
                                                </option>
                                            </select>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i></div>
                                        <div className="ed_nm"><label>Sheduled Delivery Date/Time</label>
                                            <input type="text" className="form-control" id="datetimepicker3" placeholder="26-04-2022" />
                                            <i class="fa fa-calendar" aria-hidden="true"></i>
                                            <i className="fa fa-check"
                                                aria-hidden="true"></i><i className="fa fa-exclamation-triangle"
                                                    aria-hidden="true"></i>
                                        </div>
                                        <div className="ed_nm"><label>Broker</label><input type="text" value=""
                                            placeholder="Charles C. Smith" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>

                                        </div>
                                        <div className="ed_nm"><label>Shipper</label><input type="text" value=""
                                            placeholder="Charles C. Smith" /><i className="fa fa-check" aria-hidden="true"></i><i
                                                className="fa fa-exclamation-triangle" aria-hidden="true"></i>

                                        </div>
                                        <div className="ed_nm res_dis_no"></div>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <p>&nbsp;</p>
                    <div className="btn_dv">
                        <button className="btn btn-grn"><i className="fa fa-check" aria-hidden="true"></i> Update</button>
                        <button className="btn btn-whi"><i className="fa fa-undo" aria-hidden="true"></i> Reset</button>
                        <button className="btn nodesign-btn"> Cancel</button>

                    </div>
                </div>
            </div>
        </>
    )
}