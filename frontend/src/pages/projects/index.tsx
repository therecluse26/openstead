import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import { NextPage } from 'next'
import ProjectService from '@/services/Projects/ProjectService'
import FilterableDataTable from '@/components/DataTable/FilterableDataTable'
import { Project } from '@/types/Project'

interface FilterType {
    value: string
    matchMode: string
}

interface Filters {
    name: FilterType
    description: FilterType
}

interface LazyParams {
    first: number
    rows: number
    sortField?: string
    sortOrder?: number
    filters?: Record<string, any>
}

const Projects: NextPage = () => {
    const isMounted = useRef<boolean>(false)
    const [filters, setFilters] = useState<Filters>({
        name: { value: '', matchMode: 'contains' },
        description: { value: '', matchMode: 'contains' },
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
                title={'Projects'}
                basePath={'projects'}
                createPermission="project:create"
                service={ProjectService}
                filters={filters}
                setFilters={setFilters}
                setLazyParamsCallack={lazyParamsCallback}>
                <Column
                    field="name"
                    header="Name"
                    sortable
                    body={(rowData: Project, elem: any) => {
                        return (
                            <Link href={`/projects/${rowData.id}`}>
                                {(rowData as any)[elem.field]}
                            </Link>
                        )
                    }}
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '260px' }}
                />

                <Column
                    field="description"
                    header="Description"
                    sortable
                    body={(rowData: Project, elem: any) =>
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

export default React.memo(Projects)
