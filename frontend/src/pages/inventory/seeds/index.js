import React, { useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import SeedService from '@/services/Inventory/SeedService'
import TypeFilterElement from '@/components/Inventory/TypeFilterElement'
import TypeBodyTemplateElement from '@/components/Inventory/TypeBodyTemplateElement'
import { Dropdown } from 'primereact/dropdown'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'

const Seeds = () => {
    const [types, setTypes] = useState([])
    const [lightRequirements, setLightRequirements] = useState([])
    const [lifeCycles, setLifeCycles] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        date_of_birth: { value: '', matchMode: 'equals' },
        quantity: { value: null, matchMode: 'equals' },
        life_cycle: { value: '', matchMode: 'equals' },
        light_requirement: { value: '', matchMode: 'equals' },
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
                life_cycle: {
                    ...filters.life_cycle,
                    value: filters.life_cycle.value,
                },
                light_requirement: {
                    ...filters.light_requirement,
                    value: filters.light_requirement.value,
                },
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
        SeedService.getFilters().then(data => {
            setLifeCycles(
                data?.life_cycles?.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
            setLightRequirements(
                data?.light_requirements?.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
            setTypes(
                data?.types?.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
    }

    return (
        <FilterableDataTable
            title={'Seeds'}
            basePath={'seeds'}
            service={SeedService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
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
                field="life_cycle"
                header="Lifecycle"
                sortable
                filter
                filterPlaceholder="Search"
                filterElement={options => {
                    return (
                        <Dropdown
                            value={options.value}
                            options={lifeCycles}
                            onChange={e => {
                                options.filterCallback(e.value, options.index)
                                setFilters({
                                    ...filters,
                                    life_cycle: {
                                        ...filters.life_cycle,
                                        value: e.value,
                                    },
                                })
                            }}
                            placeholder={'Search'}
                        />
                    )
                }}
                body={rowData => {
                    return rowData?.life_cycle?.label
                }}
                showFilterMenu={false}
                showClear
                style={{ width: '160px', minWidth: '160px' }}
            />

            <Column
                field="light_requirement"
                header="Light Requirement"
                sortable
                filter
                filterPlaceholder="Search"
                filterElement={options => {
                    return (
                        <Dropdown
                            value={options.value}
                            options={lightRequirements}
                            onChange={e => {
                                options.filterCallback(e.value, options.index)
                                setFilters({
                                    ...filters,
                                    light_requirement: {
                                        ...filters.light_requirement,
                                        value: e.value,
                                    },
                                })
                            }}
                            placeholder={'Search'}
                        />
                    )
                }}
                body={rowData => {
                    return (
                        rowData?.light_requirement?.icon +
                        '  ' +
                        rowData?.light_requirement?.label
                    )
                }}
                showFilterMenu={false}
                showClear
                style={{ width: '240px', minWidth: '200px' }}
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
                body={rowData => formatDate(rowData.acquired_at)}
                style={{ minWidth: '160px', width: '200px' }}
            />
        </FilterableDataTable>
    )
}

export default React.memo(Seeds)
