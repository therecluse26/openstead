import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Card } from 'primereact/card'
import { Ripple } from 'primereact/ripple'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import Link from 'next/link'
import { useToast } from '../../context/ToastContext'
import Restrict from '@/components/Authorization/Restrict'

const FilterableDataTable = ({
    title,
    children,
    service,
    filters,
    basePath,
    setLazyParamsCallack,
    selectionMode,
    createPermission = null,
    initialSortColumn = null,
    idColumn = null,
}) => {
    const isMounted = useRef(false)
    const [selected, setSelected] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [inventory, setInventory] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: perPage,
        page: 0,
        sortField: initialSortColumn ?? null,
        sortOrder: null,
        filters: filters,
    })

    const { showToast } = useToast()

    const onPage = event => {
        setLazyParams(event)
    }

    const onSort = event => {
        setLazyParams(event)
    }

    const onFilter = event => {
        setLazyParams(event)
    }

    const onSelectionChange = e => setSelected(e.value)

    const loadLazyData = () => {
        setLoading(true)

        service
            .getList({ lazyEvent: JSON.stringify(lazyParams) })
            .then(data => {
                setInventory(data.data)
                setTotalRecords(data.total)
                setPerPage(data.per_page)
            })
            .catch(e =>
                showToast(
                    e.response?.data?.message ?? 'Unknown error',
                    'error',
                ),
            )
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        isMounted.current = true
        loadLazyData()
    }, [lazyParams])

    useEffect(() => {
        setLazyParams(setLazyParamsCallack(lazyParams))
    }, [filters])

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
                { label: 50, value: 50 },
                { label: 100, value: 100 },
                {
                    label: options.totalRecords <= 1000 ? 'All' : 1000,
                    value:
                        options.totalRecords <= 1000
                            ? options.totalRecords
                            : 1000,
                },
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">{title}</h5>
                <Restrict permission={createPermission}>
                    <span className="p-input-icon-left">
                        <Link href={`${basePath}/add`}>+ Add</Link>
                    </span>
                </Restrict>
            </div>
        )
    }

    const header = renderHeader()

    return (
        <Card>
            <DataTable
                value={inventory}
                lazy
                filterDisplay="row"
                dataKey={idColumn ?? 'id'}
                header={header}
                paginator
                paginatorTemplate={paginatorTemplate}
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                sortField={lazyParams.sortField}
                sortOrder={lazyParams.sortOrder}
                onFilter={onFilter}
                filters={lazyParams.filters}
                loading={loading}
                loadingIcon={'loading-spinner'}
                selection={selected}
                selectionMode={selectionMode}
                responsiveLayout="stack"
                onSelectionChange={onSelectionChange}>
                {children}
            </DataTable>
        </Card>
    )
}

export default FilterableDataTable
