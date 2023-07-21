import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import LinkButton from '@/components/LinkButton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import { formatDate } from '@/utils/FormatDate'
import { Button } from 'primereact/button'
import InventoryDetailCard from '@/components/Custom/Inventory/InventoryDetailCard'
import Spinner from '@/components/Spinner'
import { Card } from 'primereact/card'
import ProjectService from '@/services/Projects/ProjectService'
import ProjectColumn from '@/components/Custom/Projects/ProjectColumn'

const ProjectDetail = () => {
    const isMounted = useRef(false)
    const [data, setData] = useState()
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        ProjectService.getItem(id)
            .then(data => {
                setData(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    const deleteProject = async () => {
        await ProjectService.deleteItem(id)
    }

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteProject()
            router.push('/projects')
        }
    }

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <>
            {!data?.id ? (
                <div className="card flex justify-content-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex gap-4 min-h-full overflow-y-scroll">
                    {data?.workflow?.columns
                        ?.sort((a, b) => {
                            return a.order - b.order
                        })
                        .map((column, index) => {
                            return (
                                <ProjectColumn
                                    key={index}
                                    columnData={column}
                                    items={data.items}
                                    title={column?.status?.name}
                                    statusId={column.status.id}
                                />
                            )
                        })}
                </div>
            )}
        </>
    )
}

export default React.memo(ProjectDetail)
