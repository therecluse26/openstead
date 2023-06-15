const AddErrorToasts = (
    toast,
    error,
    summary = 'Error',
    severity = 'error',
) => {
    let errors = []
    if (typeof error === 'string') {
        errors.push({
            severity: severity,
            summary: summary,
            detail: error,
        })
    }
    if (error instanceof Error) {
        errors.push({
            severity: severity,
            summary: summary,
            detail: error.message,
        })
    }
    if (error.response !== undefined) {
        for (let errField in error?.response?.data?.errors) {
            for (let err of error.response.data.errors[errField]) {
                errors.push({
                    severity: severity,
                    summary: summary,
                    detail: err,
                })
            }
        }
    }
    toast.current?.show(errors)
}

export default AddErrorToasts
