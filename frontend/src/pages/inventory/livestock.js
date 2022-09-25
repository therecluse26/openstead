import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Layouts/Inventory/InventoryList'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { LivestockService } from '@/services/inventory/LivestockService'

const Livestock = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const service = new LivestockService()
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        date_of_birth: { value: '', matchMode: 'equals' },
        breed: { value: '', matchMode: 'contains' },
        type: { value: '', matchMode: 'equals' },
    })

    useEffect(() => {
        isMounted.current = true
        loadTypes()
    }, [])

    const formatDate = value => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }
    const dateBodyTemplate = rowData => {
        return formatDate(rowData.date_of_birth)
    }

    const typeFilterElement = options => {
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

    const lazyParamsCallback = lazyParams => {
        return {
            ...lazyParams,
            filters: {
                ...filters,
                type: {
                    ...filters.type,
                    value: filters.type.value,
                },
                breed: {
                    ...filters.breed,
                    value: filters.breed.value,
                },
            },
        }
    }

    const loadTypes = () => {
        service.getTypes().then(data => {
            setTypes(
                data.map(t => {
                    return { label: t, value: t }
                }),
            )
        })
    }

    // Body Templates
    const bodyTemplate = (rowData, elem) => {
        return rowData[elem.field]
    }

    return (
        <InventoryList
            title={'Livestock'}
            service={LivestockService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

            <Column
                field="name"
                header="Name"
                sortable
                body={bodyTemplate}
                filter
                filterPlaceholder="Search"
            />
            <Column
                field="type"
                header="Type"
                sortable
                body={bodyTemplate}
                filter
                filterElement={typeFilterElement}
                filterPlaceholder="Search"
                showFilterMenu={false}
            />
            <Column
                field="date_of_birth"
                header="Date of Birth"
                sortable
                filter
                filterPlaceholder="Search"
                body={dateBodyTemplate}
                showFilterMenu={false}
                showClear
            />
            <Column
                field="breed"
                header="Breed"
                sortable
                body={bodyTemplate}
                filter
                filterPlaceholder="Search"
            />
        </InventoryList>
    )
}

export default React.memo(Livestock)
