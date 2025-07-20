import { IconGripVertical } from '@tabler/icons'
import { Card } from 'primereact/card'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useProjectStore } from '@/state/ProjectStore'
import ProjectService from '../../services/Projects/ProjectService'
import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'

const ProjectColumnItem = ({ item }) => {
    const project = useProjectStore(state => state.project)
    const setSelectedProjectItem = useProjectStore(
        state => state.setSelectedItem,
    )
    const setModalVisibility = useProjectStore(
        state => state.setModalVisibility,
    )
    const userCan = useAuthorizationStore(state => state.userCan)
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    const handleCardClick = async i => {
        const itemDetail = await ProjectService.getProjectItem(project.id, i.id)

        setSelectedProjectItem({
            id: itemDetail.id,
            title: itemDetail.title,
            description: itemDetail.description,
            status: itemDetail.status,
            assignee: itemDetail.assignee,
            creator: itemDetail.creator,
            due_date: itemDetail.due_date,
            created_at: itemDetail.created_at,
            updated_at: itemDetail.updated_at,
        })
        setModalVisibility(true)
    }

    return (
        <>
            <Card
                ref={userCan('project-item:update') ? setNodeRef : null}
                className="cursor-pointer select-none my-2 border-round-xl surface-hover"
                style={style}
                {...(userCan('project-item:update') && listeners)}
                {...(userCan('project-item:update') && attributes)}
                onClick={() => handleCardClick(item)}
                footer={
                    <>
                        {item.assignee ? (
                            <small className="text-muted flex justify-content-center">
                                {item.assignee?.avatar_url ? (
                                    <img
                                        src={item.assignee?.avatar_url}
                                        alt={item.assignee?.name}
                                        className="w-1rem border-circle mr-2"
                                    />
                                ) : (
                                    <div className="w-1rem border-circle bg-gray-300 mr-2" />
                                )}
                                {item.assignee?.name}
                            </small>
                        ) : (
                            <small className="text-muted flex justify-content-center">
                                <div className="w-1rem border-circle bg-gray-300 mr-2" />
                                Unassigned
                            </small>
                        )}
                    </>
                }>
                {userCan('project-item:update') ? (
                    <div className="grid grid-cols-2 align-items-center">
                        <div className="col-2 align-items-center ">
                            <div className="w-2rem">
                                <div className="p-2 align-items-center transition-colors transition-duration-200 border-round-md">
                                    <IconGripVertical size="1rem" />
                                </div>
                            </div>
                        </div>
                        <div className="col-10 align-items-center">
                            {item.title}
                            <br />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 align-items-center">
                        <div className="col-12 align-items-center">
                            {item.title}
                            <br />
                        </div>
                    </div>
                )}
            </Card>
        </>
    )
}

export default ProjectColumnItem
