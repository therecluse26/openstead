export const formatDate = (
    datetimestring: string | null = null,
): string | false => {
    return datetimestring && new Date(datetimestring).toLocaleDateString()
}

export const formatTime = (
    datetimestring: string | null = null,
): string | false => {
    return datetimestring && new Date(datetimestring).toLocaleTimeString()
}

export const formatDateTime = (
    datetimestring: string | null = null,
): string | false => {
    return (
        datetimestring &&
        `${formatDate(datetimestring)} ${formatTime(datetimestring)}`
    )
}

export const getAgeInYears = (dob: string | Date): number => {
    const diff_ms = Date.now() - new Date(dob).getTime()
    const age_dt = new Date(diff_ms)
    return Math.abs(age_dt.getUTCFullYear() - 1970)
}
