const headers = {
    headers: {
        "Host": "api.shipengine.com",
        // "API-Key": "TEST_yATWuml3QP2dZzZe8+LS/u3UVY1NaSz4o1BAI7irEls",
        "API-Key": "TEST_CPAX0rrJpJ/7ns4MoEHns2R5SdRPZPjsbp4eCvc0MBo",
        'Content-Type': 'application/json'
    }
}

export default headers

export const switchCaseArray=[
    { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
    { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
    { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
    { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
    { case: { $eq: ["$_id.month", 5] }, then: "May" },
    { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
    { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
    { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
    { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
    { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
    { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
    { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
  ]
