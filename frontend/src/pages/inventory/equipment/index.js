import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Custom/Inventory/InventoryList'
import { Column } from 'primereact/column'
import EquipmentService from '@/services/inventory/EquipmentService'
import { Dropdown } from 'primereact/dropdown'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'
import ScalableTag from '@/components/ScalableTag'
import TypeFilterElement from '@/components/Custom/Inventory/TypeFilterElement'

const Equipment = () => {
    const [types, setTypes] = useState([])
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        condition: { value: '', matchMode: 'equals' },
        description: { value: '', matchMode: 'contains' },
        quantity: { value: null, matchMode: 'equals' },
        type: { value: '', matchMode: 'equals' },
    })
    const equipmentConditions = [
        { value: 1, label: 'Broken' },
        { value: 2, label: 'Poor' },
        { value: 3, label: 'Fair' },
        { value: 4, label: 'Good' },
        { value: 5, label: 'Excellent' },
    ]

    const lazyParamsCallback = lazyParams => {
        return {
            ...lazyParams,
            filters: {
                ...filters,
                type: {
                    ...filters.type,
                    value: filters.type.value,
                },
                condition: {
                    ...filters.condition,
                    value: filters.condition.value,
                },
            },
        }
    }

    useEffect(() => {
        isMounted.current = true
        loadTypes()
    }, [])

    const conditionFilterElement = options => {
        return (
            <Dropdown
                value={options.value}
                options={equipmentConditions}
                onChange={e => {
                    options.filterCallback(e.value, options.index)
                    setFilters({
                        ...filters,
                        condition: {
                            ...filters.condition,
                            value: e.value,
                        },
                    })
                }}
                placeholder={'Search'}
            />
        )
    }

    const loadTypes = () => {
        EquipmentService.getTypes().then(data => {
            setTypes(
                data.map(t => {
                    return { label: t.label, value: t.key, icon: t.icon }
                }),
            )
        })
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
            title={'Equipment'}
            inventoryType={'equipment'}
            service={EquipmentService}
            filters={filters}
            setLazyParamsCallack={lazyParamsCallback}>
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

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
                style={{ minWidth: '200px' }}
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
            />
            <Column
                field="condition"
                header="Condition"
                body={rowData => {
                    return (
                        <ScalableTag
                            condition={rowData?.condition}
                            text={rowData?.condition_description}
                        />
                    )
                }}
                sortable
                filter
                filterElement={conditionFilterElement}
                filterPlaceholder="Search"
                showFilterMenu={false}
                showClear
                style={{ minWidth: '150px' }}
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
                style={{ minWidth: '160px' }}
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
        </InventoryList>
    )
}

export default React.memo(Equipment)
