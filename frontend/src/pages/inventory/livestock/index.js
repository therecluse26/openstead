import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Custom/Inventory/InventoryList'
import { Column } from 'primereact/column'
import LivestockService from '@/services/inventory/LivestockService'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import TypeFilterElement from '@/components/Custom/Inventory/TypeFilterElement'
import TypeBodyTemplateElement from '@/components/Custom/Inventory/TypeBodyTemplateElement'

const Livestock = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
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
        LivestockService.getTypes().then(data => {
            setTypes(
                data.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
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
                body={(rowData, elem) => {
                    return (
                        <Link href={`/inventory/livestock/${rowData.id}`}>
                            {rowData[elem.field]}
                            {rowData.date_of_death ? ' (deceased)' : null}
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
                field="variety"
                sortField="variety.variety_name"
                header="Breed"
                sortable
                body={(rowData, elem) => rowData[elem.field].variety_name}
                filter
                filterPlaceholder="Search"
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
                style={{ minWidth: '160px', maxWidth: '200px' }}
            />
        </InventoryList>
    )
}

export default React.memo(Livestock)
