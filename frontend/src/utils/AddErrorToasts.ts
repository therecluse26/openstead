import { AxiosError } from 'axios'
import { Toast } from '../types/Common'

interface ErrorWithResponse {
    response?: {
        data?: {
            message?: string
            errors?: Record<string, string[]>
        }
    }
}

interface ToastRef {
    current?: {
        show: (toasts: Toast[]) => void
    } | null
}

const AddErrorToasts = (
    toast: ToastRef,
    error: string | Error | AxiosError | ErrorWithResponse,
    summary: string = 'Error',
    severity: Toast['severity'] = 'error',
): void => {
    const errors: Toast[] = []

    if (typeof error === 'string') {
        errors.push({
            severity: severity,
            summary: summary,
            detail: error,
        })
    }

    // Check if error is an AxiosError by checking its properties
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError
        errors.push({
            severity: severity,
            summary: summary,
            detail: axiosError.response?.data?.message,
        })
    }

    if (error instanceof Error) {
        errors.push({
            severity: severity,
            summary: summary,
            detail: error.message,
        })
    }

    // Handle errors with response property (avoiding duplicate processing of AxiosError)
    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        error.response !== undefined &&
        !('isAxiosError' in error)
    ) {
        const errorWithResponse = error as ErrorWithResponse
        for (const errField in errorWithResponse?.response?.data?.errors) {
            const fieldErrors = errorWithResponse.response.data.errors[errField]
            if (Array.isArray(fieldErrors)) {
                for (const err of fieldErrors) {
                    errors.push({
                        severity: severity,
                        summary: summary,
                        detail: err,
                    })
                }
            }
        }
    }

    toast?.current?.show(errors)
}

export default AddErrorToasts
