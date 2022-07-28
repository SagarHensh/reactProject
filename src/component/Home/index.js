import React from "react";
import { useHistory } from "react-router-dom";

function Home() {
    let navigate = useHistory();
    function goLogin() {
        navigate.push("/login");
    }
    return (
        <>
            <div className="man_pge">
                <img src="assets/images/main-bg.png" />
                <div className="man_pge_con">
                    <img src="assets/images/amazon-logo.png" />
                    <h2>Amazon Trucking & <br />Distribution</h2>
                    <button className="btn btn-primary lob_btn" onClick={goLogin}>login</button>
                </div>
            </div>
        </>
    )
}

export default Home;