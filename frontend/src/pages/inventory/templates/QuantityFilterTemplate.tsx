import React from 'react'
import { InputNumber } from 'primereact/inputnumber'

interface FilterValue {
    value: string | number | null
    matchMode: string
}

interface Filters {
    [key: string]: FilterValue
}

interface QuantityFilterTemplateProps {
    options: {
        value: number | null
        filterCallback: (value: number | null, index?: any) => void
    }
    setFilters: (filters: Filters) => void
    filters: Filters
}

const QuantityFilterTemplate: React.FC<QuantityFilterTemplateProps> = ({
    options,
    setFilters,
    filters,
}) => {
    return (
        <InputNumber
            placeholder={'Search'}
            value={options?.value}
            onChange={(e: any) => {
                options.filterCallback(e?.value, options?.value)
                setFilters({
                    ...filters,
                    quantity: {
                        ...filters.quantity,
                        value: e?.value,
                    },
                })
            }}
        />
    )
}

export default QuantityFilterTemplate
