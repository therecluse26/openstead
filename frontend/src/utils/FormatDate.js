export const formatDate = (datestring = null) => {
    return datestring && new Date(datestring).toDateString()
}

export const getAgeInYears = dob => {
    var diff_ms = Date.now() - new Date(dob).getTime()
    var age_dt = new Date(diff_ms)
    return Math.abs(age_dt.getUTCFullYear() - 1970)
}
