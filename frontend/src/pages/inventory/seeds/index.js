import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Custom/Inventory/InventoryList'
import { Column } from 'primereact/column'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import SeedService from '@/services/inventory/SeedService'
import TypeFilterElement from '@/components/Custom/Inventory/TypeFilterElement'
import TypeBodyTemplateElement from '@/components/Custom/Inventory/TypeBodyTemplateElement'

const Seeds = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        date_of_birth: { value: '', matchMode: 'equals' },
        quantity: { value: null, matchMode: 'equals' },
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
        loadTypes()
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

    const loadTypes = () => {
        SeedService.getTypes().then(data => {
            setTypes(
                data.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
    }

    return (
        <InventoryList
            title={'Seeds'}
            inventoryType={'seeds'}
            service={SeedService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

            <Column
                field="variety"
                sortField="variety.variety_name"
                header="Variety"
                sortable
                body={rowData => {
                    return (
                        <Link href={`/inventory/seeds/${rowData.id}`}>
                            {rowData['variety']['variety_name']}
                        </Link>
                    )
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
                field="acquired_at"
                header="Date Acquired"
                sortable
                filter
                filterPlaceholder="Search"
                body={rowData => formatDate(rowData.acquired_at)}
                showFilterMenu={false}
                showClear
                style={{ minWidth: '160px', width: '200px' }}
            />
        </InventoryList>
    )
}

export default React.memo(Seeds)
