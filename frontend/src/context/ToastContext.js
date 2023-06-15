import { createContext, useContext, useRef } from 'react'
import { Toast } from 'primereact/toast'

const ToastContext = createContext()

export default ToastContext

export function ToastContextProvider({ children }) {
    const toastRef = useRef(null)
    return (
        <ToastContext.Provider value={toastRef}>
            {children}
            <Toast ref={toastRef} />
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    return useContext(ToastContext)
}
