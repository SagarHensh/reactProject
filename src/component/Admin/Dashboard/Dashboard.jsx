import React from "react";
import Sidebar from "../../Sidebar/Sidebar";
import Header from "../../Header/Header";

function Dashboard() {
    return (<>
        {/* <div className="wrapper">
            <Sidebar />
            <Header /> */}
        <div className="component-wrapper">
            <div className="page-head-section">
                <h1 className="text-uppercase">Dashboard</h1>
                <div className="show_pgn">
                    <p>Showing <strong>01st jan 2021 to 31st Dec 2021</strong>
                        <button><i className="fa fa-sort-desc" aria-hidden="true"></i></button>
                    </p>
                </div>
            </div>
            <div className="_fl dashboard-list">
                <div className="row">
                    <div className="col-md-8 dashboard-list-bx-out">
                        <div className="_fl dashboard-list-bx pr1">
                            <div className="crer_stut">
                                <h2 className="panel-title">
                                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        <i className="fa fa-angle-down" aria-hidden="true"></i> Carriers Status
                                    </a>
                                </h2>


                                <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div className="panel-body">
                                        <div className="crer_stut_dv">
                                            <div className="crer_stut_in no_co">
                                                <strong>1650</strong>
                                                <span>Total Carriers</span></div>
                                            <div className="crer_stut_in gr_co">
                                                <strong>1253</strong>
                                                <span>Active Carriers</span></div>
                                            <div className="crer_stut_in rd_co">
                                                <strong>397</strong>
                                                <span>Inactive Carriers</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="crer_stut">
                                <h2 className="panel-title">
                                    <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        <i className="fa fa-angle-down" aria-hidden="true"></i> Dispatchers Status
                                    </a>
                                </h2>

                                <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                                    <div className="panel-body"><div className="crer_stut_dv">
                                        <div className="crer_stut_in no_co">
                                            <strong>1650</strong>
                                            <span>Total Dispatchers</span></div>
                                        <div className="crer_stut_in gr_co">
                                            <strong>1253</strong>
                                            <span>Active Dispatchers</span></div>
                                        <div className="crer_stut_in rd_co">
                                            <strong>397</strong>
                                            <span>Inactive Dispatchers</span></div>
                                    </div>
                                    </div>
                                </div></div>
                            <div className="crer_stut">
                                <h2 className="panel-title">
                                    <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseTwo">
                                        <i className="fa fa-angle-down" aria-hidden="true"></i> Jobs Status
                                    </a>
                                </h2>

                                <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">

                                    <div className="panel-body">
                                        <div className="crer_stut_dv">
                                            <div className="crer_stut_in no_co">
                                                <strong>1243</strong>
                                                <span>Pending</span></div>
                                            <div className="crer_stut_in gr_co">
                                                <strong>863</strong>
                                                <span>Upcoming</span></div>
                                            <div className="crer_stut_in rd_co">
                                                <strong>380</strong>
                                                <span>Ongoing</span></div>
                                            <div className="crer_stut_in no_co">
                                                <strong>333</strong>
                                                <span>Cancelled</span></div>
                                            <div className="crer_stut_in gr_co">
                                                <strong>390</strong>
                                                <span>Completed</span></div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-4 dashboard-list-bx-out">
                        <div className="_fl dashboard-list-bx pr2">
                            <div className="activ_car">
                                <div className="selectbox">
                                    <div className="dropdwn">
                                        <select className="frm4-select mini" id="select37">
                                            <option>1 Hour</option>
                                        </select>
                                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <h2 className="panel-title">
                                    <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        <i className="fa fa-angle-down" aria-hidden="true"></i> Active Carriers
                                    </a>
                                </h2>
                                <p>28 active Carrier from last 1 hours</p>

                                <div id="collapseFour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseFour">
                                    <div className="panel-body">



                                        <ul>
                                            <li>
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>
                                            <li>
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>
                                            <li>
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>
                                            <li>
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>
                                            <li className="in-ac">
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>
                                            <li className="in-ac">
                                                <strong>Title Carrier Listing</strong>
                                                <span>2min ago</span>
                                            </li>

                                        </ul>
                                    </div>
                                </div></div>
                            <div className="activ_car">
                                <h2 className="panel-title">
                                    <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        <i className="fa fa-angle-down" aria-hidden="true"></i> Invoice Status
                                    </a>
                                </h2>
                                <p>28 active Carrier from last 1 hours</p>

                                <div id="collapseFive" className="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseFive">
                                    <div className="panel-body">

                                        Okay
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </div>
        {/* </div> */}
    </>)
}

export default Dashboard;