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
import { Menubar } from 'primereact/menubar'

const ProjectDetail = () => {
    const router = useRouter()
    const isMounted = useRef(false)
    const project = useProjectStore(state => state.project)
    const setProject = useProjectStore(state => state.setProject)
    const toast = useRef(null)
    const { query, isReady } = useRouter()
    const { id } = query

    const projectMenuItems = [
        {
            label: 'Add Item',
            icon: 'ti ti-plus',
            command: () => {},
        },

        {
            label: 'Edit Project',
            icon: 'ti ti-pencil',
            command: () => {
                router.push(`/projects/${id}/edit`)
            },
        },
        {
            label: 'Manage Users',
            icon: 'ti ti-user',
            command: () => {},
        },
        {
            label: 'Delete Project',
            icon: 'ti ti-trash',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Delete',
                    detail: 'Data Deleted',
                    life: 3000,
                })
            },
        },
    ]

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
        return project?.workflow?.sort((a, b) => {
            return a.order - b.order
        })
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

                <Menubar
                    model={projectMenuItems}
                    className="mb-4 p-3"
                    start={<div className="text-3xl mr-2">{project?.name}</div>}
                />

                {!project?.id ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="flex gap-4 min-h-full overflow-y-scroll">
                        {getColumns().map((columnData, index) => {
                            const items = getColumnItems(columnData?.status?.id)
                            return (
                                <ProjectColumn
                                    key={index}
                                    columnData={columnData}
                                    items={items}
                                    title={columnData?.status?.name}
                                    statusId={columnData?.status?.id}
                                />
                            )
                        })}
                    </div>
                )}
            </DndContext>
        </>
    )
}

export default ProjectDetail
