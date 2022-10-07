import React from 'react'
import { InputNumber } from 'primereact/inputnumber'

const QuantityFilterTemplate = ({ options, setFilters, filters }) => {
    return (
        <InputNumber
            placeholder={'Search'}
            value={options.value}
            onChange={e => {
                options.filterCallback(e.value, options.value)
                setFilters({
                    ...filters,
                    quantity: {
                        ...filters.quantity,
                        value: e.value,
                    },
                })
            }}
        />
    )
}

export default QuantityFilterTemplate
