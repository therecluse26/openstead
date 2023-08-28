import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import EquipmentService from '@/services/Inventory/EquipmentService'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import TypeFilterElement from '@/components/Inventory/TypeFilterElement'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'

const Equipment = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        description: { value: '', matchMode: 'contains' },
        quantity: { value: null, matchMode: 'equals' },
        type: { value: '', matchMode: 'equals' },
    })

    const lazyParamsCallback = lazyParams => {
        return {
            ...lazyParams,
            filters: {
                ...filters,
                type: {
                    ...filters.type,
                    value: filters.type.value,
                },
            },
        }
    }

    useEffect(() => {
        isMounted.current = true
        loadFilters()
    }, [])

    const loadFilters = () => {
        EquipmentService.getFilters().then(data => {
            setTypes(
                data?.types?.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
    }

    const bodyTypeTemplate = (rowData, elem) => {
        const type = types.find(e => {
            return e.value === rowData[elem.field]
        })
        const icon = type?.icon && (
            <span className={'type-icon'} aria-label={type?.label}>
                {type?.icon} &nbsp;
            </span>
        )
        return (
            <div>
                {icon}
                {type?.label}
            </div>
        )
    }

    return (
        <Suspense fallback={`Loading...`}>
            <FilterableDataTable
                title={'Equipment'}
                basePath={'equipment'}
                createPermission="inventory:create"
                service={EquipmentService}
                filters={filters}
                setLazyParamsCallack={lazyParamsCallback}>
                <Column
                    field="name"
                    header="Name"
                    sortable
                    body={(rowData, elem) => {
                        return (
                            <Link href={`/inventory/equipment/${rowData.id}`}>
                                {rowData[elem.field]}
                            </Link>
                        )
                    }}
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '260px' }}
                />
                <Column
                    field="type"
                    header="Type"
                    sortable
                    body={bodyTypeTemplate}
                    filter
                    filterElement={opts => {
                        return (
                            <TypeFilterElement
                                options={opts}
                                types={types}
                                setFilters={setFilters}
                                filters={filters}
                            />
                        )
                    }}
                    filterPlaceholder="Search"
                    showFilterMenu={false}
                    style={{ minWidth: '240px' }}
                />

                <Column
                    field="quantity"
                    header="Quantity"
                    sortable
                    filter
                    filterPlaceholder="Search"
                    filterElement={o => {
                        return (
                            <QuantityFilterTemplate
                                options={o}
                                setFilters={setFilters}
                                filters={filters}
                            />
                        )
                    }}
                    dataType="numeric"
                    showFilterMenu={false}
                    showClear
                    style={{ minWidth: '160px', maxWidth: '200px' }}
                />
                <Column
                    field="description"
                    header="Description"
                    sortable
                    body={(rowData, elem) => rowData[elem.field]}
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '300px' }}
                />
            </FilterableDataTable>
        </Suspense>
    )
}

export default React.memo(Equipment)
