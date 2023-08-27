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
import { useProjectStore } from '@/state/ProjectStore'
import { Menubar } from 'primereact/menubar'
import { Tooltip } from 'primereact/tooltip'
import ProjectUserDialog from '../../../components/Projects/ProjectUserDialog'
import { useToast } from '../../../context/ToastContext'
import { ProgressBar } from 'primereact/progressbar'
import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'

const AvatarList = ({ users, maxUsersToDisplay = 3 }) => {
    const count = users?.length
    const exceedsMaxUsers = count > maxUsersToDisplay

    if (count === 0) {
        return null
    }

    return (
        <span className="hidden lg:flex justify-content-end">
            {users
                ?.filter(i => i?.id !== null)
                .slice(0, maxUsersToDisplay)
                ?.map(user => {
                    return (
                        <span key={'icon_' + user?.id}>
                            <Tooltip
                                key={'tooltip_' + user?.id}
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
                        </span>
                    )
                })}
            {exceedsMaxUsers && (
                <span className="text-lg ml-2">
                    +{count - maxUsersToDisplay}
                </span>
            )}
        </span>
    )
}

const ProjectDetail = () => {
    const router = useRouter()
    const isMounted = useRef(false)
    const project = useProjectStore(state => state.project)
    const setProject = useProjectStore(state => state.setProject)
    const setProjectUsers = useProjectStore(state => state.setProjectUsers)
    const projectUsers = useProjectStore(state => state.projectUsers)
    const { showToast } = useToast()
    const { query, isReady } = useRouter()
    const { id } = query
    const userCan = useAuthorizationStore(state => state.userCan)

    const projectMenuItems = [
        userCan('project-item:create') && {
            label: 'Add Item',
            icon: 'ti ti-plus',
            command: () => {
                router.push(`/projects/${id}/items/add`)
            },
        },
        userCan('project:update') && {
            label: 'Project Settings',
            icon: 'ti ti-settings',
            command: () => {
                router.push(`/projects/${id}/edit`)
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
            .then(() =>
                showToast('Project items updated', 'success', null, 1000),
            )
            .catch(e =>
                showToast(
                    e.response?.data?.message ?? 'Unknown error',
                    'error',
                ),
            )
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

    const calculateProgressPercentage = project => {
        // Get the total points earned by summing the points for each status
        const totalPointsEarned = project?.items?.reduce((a, b) => {
            // Get the order of the status in the workflow (base 0 indexed for calculations)
            const workflowOrder =
                project?.workflow?.find(status => {
                    return status.id === b?.status?.id
                })?.order - 1

            // Calculate the percentage of the workflow that has been completed
            // The first status in the workflow is 0% and the last is 100%, distribute the points evenly
            return a + workflowOrder / (project?.workflow?.length - 1)
        }, 0)

        const percentage = (totalPointsEarned / project?.items?.length) * 100

        // round to the nearest whole number
        return Math.round(percentage)
    }

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
                <Menubar
                    model={projectMenuItems}
                    className="mb-4 p-3"
                    start={<div className="text-3xl mr-2">{project?.name}</div>}
                    end={
                        <div className="flex">
                            <AvatarList
                                users={projectUsers}
                                maxUsersToDisplay={5}
                            />
                        </div>
                    }
                />

                <ProgressBar
                    className="mb-4"
                    value={calculateProgressPercentage(project)}
                />

                {!project?.id ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <section className="md:flex gap-4 min-h-full overflow-y-scroll">
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
                    </section>
                )}
            </DndContext>
        </>
    )
}

export default ProjectDetail
