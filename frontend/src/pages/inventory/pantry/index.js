import React, { useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import PantryService from '@/services/inventory/PantryService'
import TypeFilterElement from '@/components/Custom/Inventory/TypeFilterElement'
import TypeBodyTemplateElement from '@/components/Custom/Inventory/TypeBodyTemplateElement'
import FilterableDataTable from '@/components/Custom/DataTable/FilterableDataTable'

const PantryItems = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        description: { value: '', matchMode: 'contains' },
        quantity: { value: null, matchMode: 'equals' },
        expiration_date: { value: '', matchMode: 'equals' },
        variety: {
            value: '',
            matchMode: 'contains',
            relatedSortField: 'variety_name',
            filterFieldName: 'variety.variety_name',
        },
        type: {
            value: '',
            matchMode: 'equals',
            relatedSortField: 'group_type',
            filterFieldName: 'variety.group_type',
        },
    })

    useEffect(() => {
        isMounted.current = true
        loadFilters()
    }, [])

    const formatDate = value => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
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
                    value: filters.variety?.value,
                },
            },
        }
    }

    const loadFilters = () => {
        PantryService.getFilters().then(data => {
            setTypes(
                data?.types?.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
    }

    return (
        <FilterableDataTable
            title={'Pantry Items'}
            basePath={'pantry'}
            service={PantryService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column
                field="name"
                header="Name"
                sortable
                body={(rowData, elem) => {
                    return (
                        <Link href={`/inventory/pantry/${rowData.id}`}>
                            {rowData[elem.field]}
                        </Link>
                    )
                }}
                filter
                filterPlaceholder="Search"
                style={{ minWidth: '260px' }}
            />

            <Column
                field="variety"
                sortField="variety.variety_name"
                header="Variety"
                sortable
                body={rowData => {
                    return <> {rowData['variety']['variety_name']}</>
                }}
                filter
                filterPlaceholder="Search"
                style={{ minWidth: '200px' }}
            />

            <Column
                field="type"
                sortField="variety.group_type"
                header="Type"
                sortable
                body={rowData => {
                    return (
                        <TypeBodyTemplateElement
                            rowData={rowData}
                            types={types}
                            matchField={'variety'}
                            subMatchField={'group_type'}
                        />
                    )
                }}
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
                showClear
                showFilterMenu={false}
                style={{ minWidth: '200px' }}
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
                style={{ width: '160px', minWidth: '160px' }}
            />
            <Column
                field="expiration_date"
                header="Expiration Date"
                sortable
                body={rowData => formatDate(rowData.expiration_date)}
                style={{ minWidth: '160px', width: '200px' }}
            />
        </FilterableDataTable>
    )
}

export default React.memo(PantryItems)
