import React from "react";
import { useHistory } from "react-router-dom";

export default function ViewBidDetails() {
    const navigate = useHistory();
    function goBidList() {
        navigate.push("/allBids");
    }
    return (
        <>
            <div className="component-wrapper">
                <div className="page-head-section">
                    <div className="hd_bk">

                        <i className="fa fa-long-arrow-left" aria-hidden="true" onClick={() => goBidList()}></i>
                        <strong><span>Manage Bids/ Responses</span>Bids Details</strong>
                    </div>

                </div>
                <div className="_fl prof-list-bx view-job-detail">
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Order information</h3>
                        </div>
                    </div>
                    <div className="div_divdr">
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Order ID</strong>
                                            <span>149</span>
                                        </li>
                                        <li>
                                            <strong>Leg ID</strong>
                                            <span>123456</span>
                                        </li>
                                        <li>
                                            <strong>Order Type</strong>
                                            <span>Local</span>
                                        </li>
                                        <li>
                                            <strong>Load Type</strong>
                                            <span>500 lbs</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Order Date/Time</strong>
                                            <span>01-12-2021 | 12:13</span>
                                        </li>
                                        <li>
                                            <strong>Customer Name</strong>
                                            <span>Frederick M. Riley</span>
                                        </li>
                                        <li>
                                            <strong>Customer Reference</strong>
                                            <span>Margie T. Demelo</span>
                                        </li>
                                        <li>
                                            <strong>Site/Region</strong>
                                            <span>LA</span>
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
                                            <span>Pending</span>
                                        </li>
                                        <li>
                                            <strong>Salesperson</strong>
                                            <span>Idea F. Fields</span>
                                        </li>
                                        <li>
                                            <strong>Pick up Location</strong>
                                            <span>LA</span>
                                        </li>
                                        <li>
                                            <strong>Sheduled Pick up Date/Time</strong>
                                            <span>01-12-2021 | 12:13</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="vew_dv">
                                    <ul>
                                        <li>
                                            <strong>Delivery Location</strong>
                                            <span>NY</span>
                                        </li>
                                        <li>
                                            <strong>Scheduled Delivery Date/Time</strong>
                                            <span>01-12-2021 | 12:13</span>
                                        </li>
                                        <li>
                                            <strong>Broker</strong>
                                            <span>Richard S. Jhon</span>
                                        </li>
                                        <li>
                                            <strong>Shipper</strong>
                                            <span>Gladys W. Jhon</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="div_divdr">
                        <h3>Pricing Information</h3>
                        <div className="row">
                            <div className="col-md-4 col-sm-12">
                                <div className="pric_info">
                                    <div className="pric_info_dv"><strong>Our Price</strong><span>$ 62,000.00</span></div>
                                    <div className="pric_info_dv"><strong>Quoted Price</strong><span>$ 48,000.00</span></div>
                                </div>
                            </div>

                            <div className="col-md-8 col-sm-12">
                                <div>
                                    <div className="btn_dv exp_ad nego_ad">
                                        <button className="btn btn-purp"><i className="fa fa-exclamation-circle" aria-hidden="true"></i>Negotiate</button><button className="btn btn-grn"><i className="fa fa-check" aria-hidden="true"></i>Accept</button>
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