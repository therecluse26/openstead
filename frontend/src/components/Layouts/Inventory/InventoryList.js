import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { EquipmentService } from '@/services/inventory/EquipmentService'
import { Tag } from 'primereact/tag'
import { Card } from 'primereact/card'
import { Ripple } from 'primereact/ripple'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'

const InventoryList = ({ title }) => {
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(false)
    const [perPage, setPerPage] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const isMounted = useRef(false)
    const inventoryService = new EquipmentService()
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: perPage,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            name: { value: '', matchMode: 'contains' },
            condition: { value: '', matchMode: 'equals' },
            description: { value: '', matchMode: 'contains' },
            type: { value: '', matchMode: 'equals' },
        },
    })

    const onPage = event => {
        setLazyParams(event)
    }

    const onSort = event => {
        setLazyParams(event)
    }

    let loadLazyTimeout = null

    useEffect(() => {
        isMounted.current = true
        loadLazyData()
    }, [lazyParams])

    const loadLazyData = () => {
        setLoading(true)

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout)
        }

        //imitate delay of a backend call
        inventoryService
            .getEquipmentList({ lazyEvent: JSON.stringify(lazyParams) })
            .then(data => {
                setInventory(data.data)
                setTotalRecords(data.total)
                setPerPage(data.per_page)
                setLoading(false)
            })
    }

    const paginatorTemplate = {
        layout:
            'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: options => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}>
                    <span className="p-3">
                        <i className="ti ti-chevron-left" />
                    </span>
                    <Ripple />
                </button>
            )
        },
        NextPageLink: options => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}>
                    <span className="p-3">
                        <i className="ti ti-chevron-right" />
                    </span>
                    <Ripple />
                </button>
            )
        },
        PageLinks: options => {
            if (
                (options.view.startPage === options.page &&
                    options.view.startPage !== 0) ||
                (options.view.endPage === options.page &&
                    options.page + 1 !== options.totalPages)
            ) {
                const className = classNames(options.className, {
                    'p-disabled': true,
                })

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                )
            }

            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            )
        },
        RowsPerPageDropdown: options => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 },
                { label: 'All', value: options.totalRecords },
            ]

            return (
                <Dropdown
                    value={options.value}
                    options={dropdownOptions}
                    onChange={options.onChange}
                />
            )
        },
    }

    // useEffect(() => {
    //     isMounted.current = true
    //     inventoryService.getEquipmentList().then(data => setInventory(data))
    // }, []) // eslint-disable-line react-hooks/exhaustive-deps
    //
    // const onRowExpand = event => {
    //     toast.current.show({
    //         severity: 'info',
    //         summary: 'Product Expanded',
    //         detail: event.data.name,
    //         life: 3000,
    //     })
    // }
    //
    // const onRowCollapse = event => {
    //     toast.current.show({
    //         severity: 'success',per_page
    //         summary: 'Product Collapsed',
    //         detail: event.data.name,
    //         life: 3000,
    //     })
    // }

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

    const conditionTemplate = (rowData, elem) => {
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

    return (
        <AppLayout title={title}>
            <Card>
                <h3 className="text-center">Equipment</h3>
                <DataTable
                    value={inventory}
                    lazy
                    filterDisplay="row"
                    responsiveLayout="scroll"
                    dataKey="id"
                    paginator
                    paginatorTemplate={paginatorTemplate}
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    onSort={onSort}
                    sortField={lazyParams.sortField}
                    sortOrder={lazyParams.sortOrder}
                    // onFilter={onFilter}
                    filters={lazyParams.filters}
                    loading={loading}
                    loadingIcon={'loading-spinner'}
                    // selection={selectedCustomers}
                    // onSelectionChange={onSelectionChange}
                    // selectAll={selectAll}
                    // onSelectAllChange={onSelectAllChange}
                >
                    <Column
                        field="id"
                        header="ID"
                        sortable
                        body={bodyTemplate}
                    />
                    <Column
                        field="name"
                        header="Name"
                        sortable
                        body={bodyTemplate}
                    />
                    <Column
                        field="type"
                        header="Type"
                        sortable
                        body={bodyTemplate}
                    />
                    <Column
                        field="condition"
                        header="Condition"
                        body={conditionTemplate}
                        sortable
                    />
                    <Column
                        field="description"
                        header="Description"
                        sortable
                        body={bodyTemplate}
                    />
                </DataTable>
            </Card>
        </AppLayout>
    )
}

export default InventoryList
