import { Dropdown } from 'primereact/dropdown'

const TypeFilterElement = ({
    options,
    types,
    setFilters,
    filters = { type: { value: '' } },
}) => {
    return (
        <Dropdown
            value={options.value}
            options={types}
            onChange={e => {
                options.filterCallback(e.value, options.index)
                setFilters({
                    ...filters,
                    type: {
                        ...filters.type,
                        value: e.value,
                    },
                })
            }}
            placeholder={'Search'}
        />
    )
}
export default TypeFilterElement
