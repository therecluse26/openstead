export const formatDate = (datetimestring = null) => {
    return datetimestring && new Date(datetimestring).toLocaleDateString()
}

export const formatTime = (datetimestring = null) => {
    return datetimestring && new Date(datetimestring).toLocaleTimeString()
}

export const formatDateTime = (datetimestring = null) => {
    return (
        datetimestring &&
        `${formatDate(datetimestring)} ${formatTime(datetimestring)}`
    )
}

export const getAgeInYears = dob => {
    var diff_ms = Date.now() - new Date(dob).getTime()
    var age_dt = new Date(diff_ms)
    return Math.abs(age_dt.getUTCFullYear() - 1970)
}
