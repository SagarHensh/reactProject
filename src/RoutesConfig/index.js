import * as React from "react";
import { Router, Route, Switch, BrowserRouter } from "react-router-dom";
import history from "../history";
// import { Router, Switch, Route } from "react-router-dom";
// import Dashboard from "../component/Admin/Dashboard/Dashboard";
import Home from "../component/Home";
import Login from "../component/Login";
import ErrorPage from "../component/ErrorPage/ErrorPage";
import ForgetPassword from "../component/ForgetPassword/ForgetPassword";

import AdminRoutes from "./AdminRoutes";

export default function RoutesConfig() {
    return (
        <>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/forgetPassword" component={ForgetPassword} />
                    <Route exact path="/login" component={Login} />
                    {/* <Route path="/home" component={Dashboard} /> */}


                    <AdminRoutes />
                    <Route path="*" component={ErrorPage} />

                </Switch>
            </Router>
        </>
    )
}