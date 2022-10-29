export const formatDate = (datestring = null) => {
    return datestring ? new Date(datestring).toDateString() : null
}
