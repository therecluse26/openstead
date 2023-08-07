import { Context, Ref, createContext, useContext, useRef } from 'react'
import { Toast } from 'primereact/toast'

const ToastContext: Context<any> = createContext(null)

type severity = 'success' | 'info' | 'warn' | 'error'

export default ToastContext

export function ToastContextProvider({ children }) {
    const toastRef: Ref<any> = useRef(null)

    return (
        <ToastContext.Provider value={toastRef}>
            {children}
            <Toast ref={toastRef} position={'bottom-center'} />
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    return useContext(ToastContext)
}

export function useToast() {
    const toast = useContext(ToastContext)
    const showToast = (
        detailValue: string,
        severityValue: severity = 'info',
        summaryValue: string | null = null,
    ) => {
        toast.current.show({
            severity: severityValue,
            summary:
                summaryValue ??
                severityValue.charAt(0).toUpperCase() + severityValue.slice(1),
            detail: detailValue,
        })
    }

    return { showToast }
}
