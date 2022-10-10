import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Layouts/Inventory/InventoryList'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import LivestockService from '@/services/inventory/LivestockService'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'

const Livestock = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        date_of_birth: { value: '', matchMode: 'equals' },
        variety: { value: '', matchMode: 'contains', relatedSortField: 'name' },
        quantity: { value: null, matchMode: 'equals' },
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
                variety: {
                    ...filters.variety,
                    value: filters.variety.value,
                },
            },
        }
    }

    const loadTypes = () => {
        LivestockService.getTypes().then(data => {
            setTypes(
                data.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
    }

    // Body Templates
    const bodyVarietyTemplate = (rowData, elem) => {
        return rowData[elem.field].variety_name
    }

    const bodyLinkTemplate = (rowData, elem) => {
        return (
            <Link href={`/inventory/livestock/${rowData.id}`}>
                {rowData[elem.field]}
            </Link>
        )
    }

    const bodyTypeTemplate = (rowData, elem) => {
        const type = types.find(e => {
            return e.value === rowData[elem.field]
        })
        const icon = type?.icon ? (
            <span className={'type-icon'} aria-label={type?.label}>
                {type?.icon} &nbsp;
            </span>
        ) : null
        return (
            <div>
                {icon}
                {type?.label}
            </div>
        )
    }

    return (
        <InventoryList
            title={'Livestock'}
            inventoryType={'livestock'}
            service={LivestockService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

            <Column
                field="name"
                header="Name"
                sortable
                body={bodyLinkTemplate}
                filter
                filterPlaceholder="Search"
            />
            <Column
                field="type"
                header="Type"
                sortable
                body={bodyTypeTemplate}
                filter
                filterElement={typeFilterElement}
                filterPlaceholder="Search"
                showFilterMenu={false}
            />
            <Column
                field="variety"
                sortField="variety.variety_name"
                header="Breed"
                sortable
                body={bodyVarietyTemplate}
                filter
                filterPlaceholder="Search"
            />
            <Column
                field="quantity"
                header="Quantity"
                sortable
                filter
                filterPlaceholder="Search"
                dataType={'numeric'}
                filterElement={o => {
                    return (
                        <QuantityFilterTemplate
                            options={o}
                            setFilters={setFilters}
                            filters={filters}
                        />
                    )
                }}
                showFilterMenu={false}
                showClear
                style={{ width: '160px' }}
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
        </InventoryList>
    )
}

export default React.memo(Livestock)
