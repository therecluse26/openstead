import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import LinkButton from '@/components/LinkButton'
import { Rating } from 'primereact/rating'
import ScalableTag from '@/components/ScalableTag'
import { formatDate } from '@/utils/FormatDate'
import { Button } from 'primereact/button'
import InventoryDetailCard from '@/components/Custom/Inventory/InventoryDetailCard'
import Spinner from '@/components/Spinner'
import ProjectService from '@/services/Projects/ProjectService'

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
                <>
                    <div className="flex flex-row flex-wrap align-items-center justify-content-center gap-4 h-24">
                        {data?.workflow?.columns
                            ?.sort((a, b) => {
                                return a.order - b.order
                            })
                            .map((column, index) => {
                                return (
                                    <div className="card h-24" key={index}>
                                        <div className="card-header">
                                            <h5>{column?.status?.name}</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="p-grid">Task</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </>
            )}
        </>
    )
}

export default React.memo(ProjectDetail)
