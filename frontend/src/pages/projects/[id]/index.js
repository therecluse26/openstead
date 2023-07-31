import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@/components/Spinner'
import ProjectService from '@/services/Projects/ProjectService'
import ProjectColumn from '@/components/Custom/Projects/ProjectColumn'
import {
    DndContext,
    useSensor,
    MouseSensor,
    TouchSensor,
    useSensors,
} from '@dnd-kit/core'
import { Toast } from 'primereact/toast'
import { useProjectStore } from '@/components/Custom/Projects/projectStore'
import ProjectItemDialog from '@/components/Custom/Projects/ProjectItemDialog'

const ProjectDetail = () => {
    const isMounted = useRef(false)

    const project = useProjectStore(state => state.project)
    const setProject = useProjectStore(state => state.setProject)

    const toast = useRef(null)
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        ProjectService.getProject(id)
            .then(data => {
                setProject(data)
            })
            .catch(e => {
                alert(e)
            })
    }

    const updateProjectItems = async updatedProject => {
        await ProjectService.updateItems(id, updatedProject?.items)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Updated',
                })
            })
            .catch(e => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.response?.data?.message ?? 'Unknown error',
                })
            })
    }
    // Get column data including grouped items by status
    const getColumns = () => {
        return project?.workflow?.columns
            ?.sort((a, b) => {
                return a.order - b.order
            })
            .reduce(
                (result, obj) => ({
                    ...result,
                    [obj.status.id]: obj,
                }),
                {},
            )
    }

    // Get items by status
    const getColumnItems = statusId => {
        return project?.items.filter(item => {
            return item.status.id === statusId
        })
    }

    const getItemById = id => {
        return project?.items.find(item => {
            return item.id === id
        })
    }

    const handleDragEnd = event => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const item = getItemById(active.id)
            if (item.status.id === over.id) {
                return
            }
            setProject({
                ...project,
                items: project.items.map(item => {
                    if (item.id === active.id) {
                        item.status.id = over.id
                    }
                    return item
                }),
            })

            updateProjectItems(project)
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 15 pixels before activating
            activationConstraint: {
                distance: 15,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 15px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 15,
            },
        }),
    )

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <>
            {project?.id && <ProjectItemDialog projectId={project.id} />}

            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                <Toast ref={toast} />

                {!project?.id ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="flex gap-4 min-h-full overflow-y-scroll">
                        {Object.entries(getColumns()).map(
                            (columnData, index) => {
                                const items = getColumnItems(columnData[0])
                                return (
                                    <ProjectColumn
                                        key={index}
                                        columnData={columnData[1]}
                                        items={items}
                                        title={columnData[1].status.name}
                                        statusId={columnData[0]}
                                    />
                                )
                            },
                        )}
                    </div>
                )}
            </DndContext>
        </>
    )
}

export default ProjectDetail
