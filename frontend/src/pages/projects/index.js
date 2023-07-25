import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column'
import Link from 'next/link'
import ProjectService from '@/services/Projects/ProjectService'
import FilterableDataTable from '@/components/Custom/DataTable/FilterableDataTable'

const Projects = () => {
    const isMounted = useRef(false)
    const [filters, setFilters] = useState({
        name: { value: '', matchMode: 'contains' },
        description: { value: '', matchMode: 'contains' },
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
                title={'Projects'}
                basePath={'projects'}
                service={ProjectService}
                filters={filters}
                setFilters={setFilters}
                setLazyParamsCallack={lazyParamsCallback}>
                <Column
                    field="name"
                    header="Name"
                    sortable
                    body={(rowData, elem) => {
                        return (
                            <Link href={`/projects/${rowData.slug}`}>
                                {rowData[elem.field]}
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
                    body={(rowData, elem) => rowData[elem.field]}
                    filter
                    filterPlaceholder="Search"
                    style={{ minWidth: '300px' }}
                />
            </FilterableDataTable>
        </Suspense>
    )
}

export default React.memo(Projects)
