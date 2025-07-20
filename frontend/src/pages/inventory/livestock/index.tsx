import React, { useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import { NextPage } from 'next'
import LivestockService from '@/services/Inventory/LivestockService'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import TypeFilterElement from '@/components/Inventory/TypeFilterElement'
import TypeBodyTemplateElement from '@/components/Inventory/TypeBodyTemplateElement'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'
import { Livestock } from '@/types/Inventory'
import { DropdownItem } from '@/types/Common'

interface FilterValue {
    value: string | number | null
    matchMode: string
    relatedSortField?: string
    filterFieldName?: string
}

interface LivestockFilters {
    name: FilterValue
    quantity: FilterValue
    variety: FilterValue
    type: FilterValue
}

const LivestockPage: NextPage = () => {
    const [types, setTypes] = useState<DropdownItem[]>([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState<LivestockFilters>({
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

    const lazyParamsCallback = (lazyParams: any) => {
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
        LivestockService.getFilters().then((data: any) => {
            setTypes(
                data?.types?.map((t: any) => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }) || [],
            )
        })
    }

    return (
        <FilterableDataTable
            title={'Livestock'}
            basePath={'livestock'}
            createPermission="inventory:create"
            service={LivestockService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column
                field="name"
                header="Name"
                sortable
                body={(rowData: Livestock, elem: any) => {
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
                body={(rowData: Livestock) => {
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
                filterElement={(opts: any) => {
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
                body={(rowData: any, elem: any) =>
                    rowData[elem.field]?.variety_name
                }
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
                filterElement={(o: any) => {
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
        </FilterableDataTable>
    )
}

export default React.memo(LivestockPage)
