export const APP_LAST_URI = Object.freeze({

  signin: {
    path: "v1/signIn",
    isAuth: false,
    method: "POST",
  },
  forgetPassword: {
    path: "v1/forgetPassword",
    isAuth: false,
    method: "POST",
  },
  verifyOTP: {
    path: "v1/verifyOTP",
    isAuth: false,
    method: "POST",
  },
  resetPassword: {
    path: "v1/resetPassword",
    isAuth: false,
    method: "POST",
  },
  imageUpload: {
    path: "v1/imageupload",
    isAuth: false,
    method: "POST",
  },
  profileDetails: {
    path: "v1/profile/details",
    isAuth: true,
    method: "POST",
  },
  profileUpdate: {
    path: "v1/profile/update",
    isAuth: true,
    method: "POST",
  },
  userListData: {
    path: "v1/user/list",
    isAuth: true,
    method: "POST",
  },
  getLandingData: {
    path: "v1/getLandingData",
    isAuth: false,
    method: "GET",
  },
  changePassword: {
    path: "v1/profile/changePassword",
    isAuth: true,
    method: "POST",
  },
  createUser: {
    path: "v1/user/create",
    isAuth: true,
    method: "POST",
  },
  viewUser: {
    path: "v1/user/details",
    isAuth: true,
    method: "POST",
  },
  userStatusChange: {
    path: "v1/user/activeDeactiveUser",
    isAuth: true,
    method: "POST",
  },
  userUpdate: {
    path: "v1/user/update",
    isAuth: true,
    method: "POST",
  },
  userPasswordUpdate: {
    path: "v1/user/updateUserPassword",
    isAuth: true,
    method: "POST",
  },
  userListExport: {
    path: "v1/user/export",
    isAuth: true,
    method: "POST",
  },
  carrierListData: {
    path: "v1/carrier/list",
    isAuth: true,
    method: "POST",
  },
  updateCarrierStatus: {
    path: "v1/carrier/updateCarrierStatus",
    isAuth: true,
    method: "POST",
  },
  carrierDetails: {
    path: "v1/carrier/details",
    isAuth: true,
    method: "POST",
  },
  carrierExport: {
    path: "v1/carrier/carrierListExport",
    isAuth: true,
    method: "POST",
  },

  vehicleListData: {
    path: "v1/vehicle/getVehicleList",
    isAuth: true,
    method: "POST",
  },
  vehicleListExport: {
    path: "v1/vehicle/getVehicleListExport",
    isAuth: true,
    method: "POST",
  },
  addVehicle: {
    path: "v1/vehicle/add",
    isAuth: true,
    method: "POST",
  },
  allVehicle: {
    path: "v1/getVehicleMasters",
    isAuth: false,
    method: "GET",
  },
  fetchVehicleData: {
    path: "v1/vehicle/getVehicleDtlByUser",
    isAuth: true,
    method: "POST",
  },
  updateVehicle: {
    path: "v1/vehicle/update",
    isAuth: true,
    method: "POST",
  },
  deleteVehicle: {
    path: "v1/vehicle/delete",
    isAuth: true,
    method: "POST",
  },
  orderList: {
    path: "v1/order/list",
    isAuth: true,
    method: "POST",
  },
  orderDetails: {
    path: "v1/order/details",
    isAuth: true,
    method: "POST",
  },
  exportOrderList: {
    path: "v1/order/export",
    isAuth: true,
    method: "POST",
  },
  bidList: {
    path: "v1/bid/list",
    isAuth: true,
    method: "POST",
  },
  acceptBid: {
    path: "v1/order/confirmJobRequestByAdmin",
    isAuth: true,
    method: "POST",
  },
  getCurrentLocationOfVehicle: {
    path: "v1/order/getCurrentLocationOfVehicle",
    isAuth: true,
    method: "POST",
  },
});