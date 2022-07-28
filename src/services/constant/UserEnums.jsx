export const APPLICATION_ROLE = Object.freeze({
    ADMIN: 1,
    DISPATCHER: 2,
    CARRIER: 3
})

export const PLATFORM = Object.freeze({
    IOS: 1,
    ANDROID: 2,
    WEB: 3,
})

export const CARRIER_STATUS = [{
    id: "0",
    name: "Pending"
}, {
    id: "1",
    name: "Ongoing"
}, {
    id: "2",
    name: "Cancelled"
}, {
    id: "3",
    name: "Partial Completion"
}, {
    id: "5",
    name: "Completed"
}]

export const JOB_STATUS = [{
    id: "2",
    name: "In progress"
}, {
    id: "3",
    name: "loaded"
}, {
    id: "1",
    name: "delivered"
}]

export const LOCATION_STATUS = [{
    id: "1",
    name: "Arrived At Time"
}, {
    id: "2",
    name: "Arrived at destination"
}]