import React from "react";
import Sidebar from "../component/Sidebar/Sidebar";
import Header from "../component/Header/Header";
import Dashboard from "../component/Admin/Dashboard/Dashboard";
import { Route } from "react-router-dom";
import AddUser from "../component/Admin/ManageUsers/AddUser/AddUser";
import UserList from "../component/Admin/ManageUsers/UserList/UserList";
import ViewProfile from "../component/Admin/Profile/ViewProfile";
import EditProfile from "../component/Admin/Profile/EditProfile";
import ChangePassword from "../component/Admin/Profile/ChangePassword";
import ManageCarriers from "../component/Admin/ManageCarriers/manageCarriers";
import AvailableCarrier from "../component/Admin/ManageCarriers/AvailableCarrier";

import ManageVehicles from "../component/Admin/Vehicle/ManageVehicle/ManageVehicles";
import VehicleDetails from "../component/Admin/Vehicle/ManageVehicle/VehicleDetails";
import VehicleDetailsEdit from "../component/Admin/Vehicle/ManageVehicle/VehicleDetailsEdit";
import OrderManagement from "../component/Admin/ManageOrder/OrderManagement";
import ViewJobDetails from "../component/Admin/ManageOrder/ViewJobDetails";
import EditJobDetails from "../component/Admin/ManageOrder/EditJobDetails";
import DispatcherDashboard from "../component/Dispatcher/Dashboard/DispatcherDashboard";
import BidList from "../component/Admin/Manage Bids/BidList/BidList";
import ViewBidDetails from "../component/Admin/Manage Bids/ViewBid/ViewBidDetails";
import RealtimeTracking from "../component/Admin/Vehicle/RealtimeTracking/RealtimeTracking";
import InvoiceList from "../component/Admin/ManageInvoice/InvoiceList";
import ErrorPage from "../component/ErrorPage/ErrorPage";

export default class AdminRoutes extends React.Component {
    render() {
        return (
            <>
                <div className="wrapper">
                    <Sidebar />
                    <Header />
                    <Route exact path="/home" component={Dashboard} />
                    <Route path="/allusers" component={UserList} />
                    <Route path="/addUser" component={AddUser} />
                    <Route path="/myProfile" component={ViewProfile} />
                    <Route path="/editProfile" component={EditProfile} />
                    <Route path="/changePassword" component={ChangePassword} />
                    <Route path="/manageCarriers" component={ManageCarriers} />
                    <Route path="/availableCarriers" component={AvailableCarrier} />
                    <Route path="/allBids" component={BidList} />
                    <Route path="/viewBidDetails" component={ViewBidDetails} />
                    <Route path="/liveTracking" component={RealtimeTracking} />
                    <Route path="/invoice" component={InvoiceList} />


                    {/* ............vehicle.............. */}

                    <Route path="/Managevehicle" component={ManageVehicles} />
                    <Route path="/Vehicledetail" component={VehicleDetails} />
                    <Route path="/Vehicledetailedit" component={VehicleDetailsEdit} />
                    <Route path="/orderManagement" component={OrderManagement} />
                    <Route path="/viewJobDetails" component={ViewJobDetails} />
                    <Route path="/editJobDetails" component={EditJobDetails} />

                    {/* ............... Dispatcher dashboard............... */}

                    <Route path="/dispatcherDashboard" component={DispatcherDashboard} />

                    <Route path="/errorPage" component={ErrorPage} />
                </div>
            </>
        )
    }
}