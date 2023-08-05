import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@/components/Spinner'
import ProjectService from '@/services/Projects/ProjectService'
import ProjectColumn from '@/components/Projects/ProjectColumn'
import ProjectItemDialog from '@/components/Projects/ProjectItemDialog'
import {
    DndContext,
    useSensor,
    MouseSensor,
    TouchSensor,
    useSensors,
} from '@dnd-kit/core'
import { Toast } from 'primereact/toast'
import { useProjectStore } from '@/state/ProjectStore'
import { Menubar } from 'primereact/menubar'
import { Tooltip } from 'primereact/tooltip'
import { Button } from 'primereact/button'
import ProjectUserDialog from '../../../components/Projects/ProjectUserDialog'

const AvatarList = ({ users }) => {
    return (
        <div className="hidden lg:flex justify-content-end">
            {users?.map(user => {
                return (
                    <>
                        <Tooltip
                            target={'#avatar_' + user?.id}
                            content={user?.name}
                            position="bottom"
                        />
                        <img
                            key={'avatar_' + user?.id}
                            id={'avatar_' + user?.id}
                            src={user?.avatar}
                            alt={user?.name}
                            className="-ml-3 border-circle w-3rem h-3rem"
                        />
                    </>
                )
            })}
        </div>
    )
}

const ProjectDetail = () => {
    const router = useRouter()
    const isMounted = useRef(false)
    const project = useProjectStore(state => state.project)
    const setProject = useProjectStore(state => state.setProject)
    const setProjectUsers = useProjectStore(state => state.setProjectUsers)
    const projectUsers = useProjectStore(state => state.projectUsers)

    const toast = useRef(null)
    const { query, isReady } = useRouter()
    const { id } = query

    const projectMenuItems = [
        {
            label: 'Add Item',
            icon: 'ti ti-plus',
            command: () => {
                router.push(`/projects/${id}/items/add`)
            },
        },
        {
            label: 'Edit Project',
            icon: 'ti ti-pencil',
            command: () => {
                router.push(`/projects/${id}/edit`)
            },
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
                setProjectUsers(data?.users)
                delete data?.users
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

            {project?.users && <ProjectUserDialog projectId={project.id} />}

            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                <Toast ref={toast} />

                <Menubar
                    model={projectMenuItems}
                    className="mb-4 p-3"
                    start={<div className="text-3xl mr-2">{project?.name}</div>}
                    end={
                        <div className="flex">
                            <AvatarList users={projectUsers} />
                            <Button
                                label="Manage Users"
                                className="p-button-text ml-2 flex justify-content-end"
                                icon="pi pi-user"
                                onClick={() => {}}
                            />
                        </div>
                    }
                />

                {!project?.id ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="md:flex gap-4 min-h-full overflow-y-scroll">
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
