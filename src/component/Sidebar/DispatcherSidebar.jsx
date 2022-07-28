import React from "react";
import { useHistory } from "react-router-dom";


function DispatcherSidebar() {
    let navigate = useHistory();
    function onRoute(param) {
        if (param === "home") {
            navigate.push("/dispatcherDashboard");
        } else if (param === "allUsers") {
            navigate.push("/allusers");
        } else if (param === "allCarriers") {
            navigate.push("/manageCarriers");
        } else if (param === "availableCarriers") {
            navigate.push("/availableCarriers");
        } else if (param === "vehicle") {
            navigate.push("/Managevehicle");
        } else if (param === "orderManagement") {
            navigate.push("/errorPage");
        } else if (param === "live") {
            navigate.push("/liveTracking");
        }
    }
    return (<>
        <nav className="side-navigaiton">
            <figure className="logo">
                <a href="javascript:void(0)"><img src="assets/images/amazon-site-logo.png" /></a>
            </figure>

            <button className="close-nav">X</button>
            <div className="side_navigatoin">
                <h5>Menu Items</h5>
                <ul>
                    <li className="active">
                        <a href="javascript:void(0)" className="ico dashboard" onClick={() => onRoute("home")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn1.png" /></figure><span>Dashoard</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" className="ico Roles" onClick={() => onRoute("availableCarriers")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn4.png" /></figure><span>Carriers</span></a>
                    </li>
                    {/* <li class="dropdown">
                        <a href="javascript:void(0)" className="ico Roles dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" >
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn3.png" /></figure><span>Manage Carriers</span>
                            <span className="caret"></span></a>
                        <ul className="dropdown-menu" role="menu">
                            <li className="active"><a href="javascript:void(0)" onClick={() => onRoute("allCarriers")}>Carrier Requests</a></li>
                            <li><a href="javascript:void(0)" onClick={() => onRoute("availableCarriers")}>Available Carriers</a></li>
                        </ul>
                    </li> */}
                    <li className="dd-menu">
                        <a href="javascript:void(0)" className="ico Requests" onClick={() => onRoute("orderManagement")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn3.png" /></figure><span>Manage Jobs</span>
                            {/* <button className="count_no">3</button> */}
                        </a>

                    </li>
                    <li>
                        <a href="javascript:void(0)" className="ico Job" onClick={() => onRoute("live")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn5.png" /></figure><span>Live Carrier Tracking</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" className="ico Servcie" onClick={() => onRoute("orderManagement")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn6.png" /></figure><span>Manage Quotes</span></a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" className="ico Departments" onClick={() => onRoute("orderManagement")}>
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn7.png" /></figure><span>Manage Documents</span></a>
                    </li>
                    {/* <li className="dd-menu">
                        <a href="javascript:void(0)" className="ico Clinets">
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn3.png" /></figure><span>Manage Invoice</span></a>

                    </li>
                    <li>
                        <a href="javascript:void(0)" className="ico Vendors">
                            <figure className="menu-link-icon"><img src="assets/images/menu/nav-side-icn8.png" /></figure><span>Report</span></a>
                    </li> */}

                </ul>
            </div>
        </nav>
    </>)
}

export default DispatcherSidebar;