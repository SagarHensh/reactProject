function InvoiceList() {
    return (
        <>
            <div className="component-wrapper">


                <div className="page-head-section no_bor">
                    <h1 className="text-uppercase">Manage Invoice</h1>


                </div>
                <div className="listing-component-app">
                    <div className="vendor-info _fl sdw">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>Available Invoice</h3>
                            </div>
                        </div>
                        <div className="new_rqst_tab">

                            <div className="available-carr">

                                <div className="" id="newrqst">
                                    <div className="filtr_sc">
                                        <div className="filt fil_b"><i className="fa fa-filter" aria-hidden="true"></i> Filter by</div>
                                        <div className="filt dt_dv">
                                            <div class="dte">
                                                <input value="Date" type="text" class="" />
                                                <i class="fa fa-caret-down input-prefix active" aria-hidden="true"></i>

                                                <label for="datepicker"><i class="fa fa-calendar" aria-hidden="true">

                                                </i>
                                                    <input type="text" id="datepicker" autocomplete="off" placeholder="Select date" />
                                                </label>

                                            </div>



                                        </div>

                                        <div className="filt stus crerty">Status <select className="slec">
                                            <option>
                                                All
                                            </option>
                                        </select></div>


                                        <div className="filt aply"><button className="btn btn-aply">Apply</button></div>
                                        <div className="filt srce">
                                            <input type="text" placeholder="Search Carrier by name, email or mobile number" />
                                            <button className="btn fil-src_btn"><i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="table-listing-app">
                                        <div className="table-responsive">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <th style={{ width: "10%" }}>Invoice #
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "9%" }}>Order ID
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "10%" }}>Carrier #
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "14%" }}>Carrier Name
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "14%" }}>Amount Due($)
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "12%" }}>Invoice Date
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "9%" }}>Due Date
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "12%" }}>Attachment
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "9%" }}>Status
                                                        <div className="sorting_btn"> <button className="t1"><img
                                                            src="assets/images/sorting-btn1.jpg" /></button><button
                                                                className="t1"><img src="assets/images/sorting-btn2.jpg" /></button></div>
                                                    </th>
                                                    <th style={{ width: "6%" }}>Action </th>
                                                </tr>
                                                <tr>
                                                    <td>123456</td>
                                                    <td>125 22 987</td>
                                                    <td>YT228 96</td>
                                                    <td>Norman R. Farrelly</td>
                                                    <td>$ 120,000.00</td>
                                                    <td>10-12-2021</td>
                                                    <td>12-12-2021</td>
                                                    <td><i className="fa fa-file-text-o" aria-hidden="true"></i></td>
                                                    <td className="red_txt"><strong>PENDING</strong></td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink3">


                                                                <ul>

                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal">View Details</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Share</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Edit</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Download</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Delete</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>123456</td>
                                                    <td>125 22 987</td>
                                                    <td>YT228 96</td>
                                                    <td>Norman R. Farrelly</td>
                                                    <td>$ 120,000.00</td>
                                                    <td>10-12-2021</td>
                                                    <td>12-12-2021</td>
                                                    <td><i className="fa fa-file-text-o" aria-hidden="true"></i></td>
                                                    <td className="dgrn_txt"><strong>PAID</strong></td>
                                                    <td>
                                                        <div className="dropdown show">
                                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src="assets/images/three-dots.jpg" />
                                                            </a>
                                                            <div className="dropdown-menu tbl-drop-links" aria-labelledby="dropdownMenuLink3">


                                                                <ul>

                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="#exampleModal">View Details</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Share</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Edit</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Download</a>
                                                                    </li>
                                                                    <li><a href="#" data-toggle="modal"
                                                                        data-target="">Delete</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div className="peg_blo">
                                            <div className="dataTables_info" id="dtBasicExample_info" role="status" aria-live="polite">
                                                Showing <b>11</b> to <b>20</b> of <b>57</b> entries</div>

                                            <div className="dataTables_paginate paging_simple_numbers" id="dtBasicExample_paginate">
                                                <ul className="pagination">
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="1" tabindex="0" className="page-link">1</a></li>
                                                    <li className="paginate_button page-item active"><a href="#"
                                                        aria-controls="dtBasicExample" data-dt-idx="2" tabindex="0"
                                                        className="page-link">2</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="3" tabindex="0" className="page-link">3</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="4" tabindex="0" className="page-link">4</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="5" tabindex="0" className="page-link">5</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="dtBasicExample"
                                                        data-dt-idx="6" tabindex="0" className="page-link">6</a></li>

                                                </ul>
                                            </div>
                                            <div className="dataTables_length bs-select" id="dtBasicExample_length"><label>Show <select
                                                name="dtBasicExample_length" aria-controls="dtBasicExample"
                                                className="custom-select custom-select-sm form-control form-control-sm">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select> rows</label></div>
                                            <div className="pag_btn">
                                                <button className="paginate_button page-item previous" id="dtBasicExample_previous"><a
                                                    href="#" aria-controls="dtBasicExample" data-dt-idx="0" tabindex="0"
                                                    className="page-link"><img src="assets/images/left-arrow.png" /></a></button>
                                                <button className="paginate_button page-item next" id="dtBasicExample_next"><a href="#"
                                                    aria-controls="dtBasicExample" data-dt-idx="7" tabindex="0"
                                                    className="page-link"><img src="assets/images/right-arrow.png" /></a></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modal invoice details--> */}
            <div className="modal fade bd-example-modal-lg Carrier_pop" id="exampleModal" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg usr_dtls" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5><i className="fa fa-id-card-o" aria-hidden="true"></i> Invoice Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="Carrier_pop">
                                <div className="invoice_pop">
                                    <ul>
                                        <li>Invoice # <strong>126354</strong></li>
                                        <li>Order ID <strong>126354</strong></li>
                                        <li>Carrier # <strong>AER248569</strong></li>
                                        <li>Carrier Name <strong>Carrier Full Name</strong></li>
                                        <li>Total Amount Due($) <strong>$ 120,000.00</strong></li>
                                        <li>Invoice Date <strong>10-12-2021</strong></li>
                                        <li>Due Date <strong>10-12-2021</strong></li>
                                        <li>Status <strong>Pending</strong></li>
                                        <li>Attachment <strong>View attachment <i className="fa fa-file-text-o" aria-hidden="true"></i></strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvoiceList;