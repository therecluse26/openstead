import React, { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@/components/Spinner'
import ProjectService from '@/services/Projects/ProjectService'
import ProjectColumn from '@/components/Custom/Projects/ProjectColumn'
import { DndContext } from '@dnd-kit/core'
import { atom, Provider, useAtom } from 'jotai'
import { Toast } from 'primereact/toast'
import { debounce } from 'lodash'
const baseProjectAtom = atom()
const projectAtom = atom(
    get => get(baseProjectAtom),
    (get, set, update) => set(baseProjectAtom, update),
)

const ProjectDetail = () => {
    const isMounted = useRef(false)
    const [project, setProject] = useAtom(projectAtom)
    const toast = useRef(null)
    const router = useRouter()
    const { query, isReady } = useRouter()
    const { id } = query

    const loadData = () => {
        if (!isReady) {
            return
        }
        ProjectService.getItem(id)
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
                    summary: 'Success',
                    detail: 'Item(s) updated',
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

    const debouncedUpdateItems = useCallback(
        debounce(updateProjectItems, 2000),
        [project],
    )

    // const confirmDelete = () => {
    //     if (confirm('Are you sure you want to delete this item?')) {
    //         deleteProject()
    //         router.push('/projects')
    //     }
    // }
    //
    // const deleteProject = async () => {
    //     await ProjectService.deleteItem(id)
    // }

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

    const handleDragEnd = event => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setProject({
                ...project,
                items: project.items.map(item => {
                    if (item.id === active.id) {
                        item.status.id = over.id
                    }
                    return item
                }),
            })

            debouncedUpdateItems(project)
        }
    }

    // Load initial data
    useEffect(() => {
        isMounted.current = true
        loadData()
    }, [id])

    return (
        <Provider>
            <DndContext onDragEnd={handleDragEnd}>
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
        </Provider>
    )
}

export default React.memo(ProjectDetail)
