import React, { useEffect, useRef, useState } from 'react'
import InventoryList from '@/components/Layouts/Inventory/InventoryList'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import EquipmentService from '@/services/inventory/EquipmentService'
import { Dropdown } from 'primereact/dropdown'
import Link from 'next/link'
import QuantityFilterTemplate from '@/pages/inventory/templates/QuantityFilterTemplate'

const Equipment = () => {
    const [equipmentTypes, setEquipmentTypes] = useState([])
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
        loadEquipmentTypes()
    }, [])

    const typeFilterElement = options => {
        return (
            <Dropdown
                value={options.value}
                options={equipmentTypes}
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

    const loadEquipmentTypes = () => {
        EquipmentService.getTypes().then(data => {
            setEquipmentTypes(
                data.map(t => {
                    return { label: t, value: t }
                }),
            )
        })
    }

    const getConditionBadge = condition => {
        switch (condition) {
            case 1:
                return 'danger'
            case 2:
                return 'warning'
            case 3:
                return 'info'
            case 4:
                return 'primary'
            case 5:
                return 'success'
        }
    }

    const conditionTemplate = rowData => {
        return (
            <Tag
                className="mr-2"
                severity={getConditionBadge(rowData.condition)}
                value={rowData.condition_description}
            />
        )
    }

    // Body Templates
    const bodyTemplate = (rowData, elem) => {
        return rowData[elem.field]
    }

    const bodyLinkTemplate = (rowData, elem) => {
        return (
            <Link href={`/inventory/equipment/${rowData.id}`}>
                {rowData[elem.field]}
            </Link>
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
                body={bodyLinkTemplate}
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
                field="condition"
                header="Condition"
                body={conditionTemplate}
                sortable
                filter
                filterElement={conditionFilterElement}
                filterPlaceholder="Search"
                showFilterMenu={false}
                showClear
                style={{ width: '150px' }}
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
                style={{ width: '160px' }}
            />
            <Column
                field="description"
                header="Description"
                sortable
                body={bodyTemplate}
                filter
                filterPlaceholder="Search"
                style={{ width: '40%' }}
            />
        </InventoryList>
    )
}

export default React.memo(Equipment)
