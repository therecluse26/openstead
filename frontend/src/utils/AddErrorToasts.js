const AddErrorToasts = (
    toast,
    error,
    summary = 'Error',
    severity = 'error',
) => {
    let errors = []
    for (let errField in error.response.data.errors) {
        for (let err of error.response.data.errors[errField]) {
            errors.push({
                severity: severity,
                summary: summary,
                detail: err,
            })
        }
    }
    toast.current?.show(errors)
}

export default AddErrorToasts
