import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import UserService from '@/services/Users/UserService'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'

const Users = () => {
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        email: { value: '', matchMode: 'contains' },
    })

    const lazyParamsCallback = lazyParams => {
        return {
            ...lazyParams,
            filters: {
                ...filters,
            },
        }
    }

    useEffect(() => {
        isMounted.current = true
    }, [])

    return (
        <Suspense fallback={`Loading...`}>
            <FilterableDataTable
                title={'Users'}
                basePath={'users'}
                createPermission="user:create"
                service={UserService}
                filters={filters}
                setFilters={setFilters}
                setLazyParamsCallack={lazyParamsCallback}
                initialSortColumn={'user_id'}
                idColumn={'user_id'}>
                <Column
                    field="name"
                    header="Name"
                    sortable
                    body={(rowData, elem) => {
                        return (
                            <div className="flex align-items-center">
                                <img
                                    key={'avatar_' + rowData?.id}
                                    id={'avatar_' + rowData?.id}
                                    src={rowData?.avatar}
                                    alt={rowData?.name}
                                    className="vertical-align-middle border-circle w-2rem h-2rem mr-2"
                                />

                                <Link
                                    href={`/users/${rowData.id}`}
                                    className="vertical-align-middle">
                                    {rowData[elem.field]}
                                </Link>
                            </div>
                        )
                    }}
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '260px' }}
                />

                <Column
                    field="email"
                    header="Email"
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

export default React.memo(Users)
