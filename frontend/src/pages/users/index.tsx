import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import { NextPage } from 'next'
import UserService from '@/services/Users/UserService'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'
import { User } from '@/types/User'

interface FilterType {
    value: string
    matchMode: string
}

interface Filters {
    name: FilterType
    email: FilterType
}

interface LazyParams {
    first: number
    rows: number
    sortField?: string
    sortOrder?: number
    filters?: Record<string, any>
}

const Users: NextPage = () => {
    const isMounted = useRef<boolean>(false)
    const [filters, setFilters] = useState<Filters>({
        name: { value: '', matchMode: 'contains' },
        email: { value: '', matchMode: 'contains' },
    })

    const lazyParamsCallback = (lazyParams: LazyParams) => {
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
                    body={(rowData: User, elem: any) => {
                        return (
                            <div className="flex align-items-center">
                                <img
                                    key={'avatar_' + rowData?.id}
                                    id={'avatar_' + rowData?.id}
                                    src={(rowData as any)?.avatar}
                                    alt={rowData?.name}
                                    className="vertical-align-middle border-circle w-2rem h-2rem mr-2"
                                />

                                <Link
                                    href={`/users/${rowData.id}`}
                                    className="vertical-align-middle">
                                    {(rowData as any)[elem.field]}
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
                    body={(rowData: User, elem: any) =>
                        (rowData as any)[elem.field]
                    }
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '300px' }}
                />
            </FilterableDataTable>
        </Suspense>
    )
}

export default React.memo(Users)
