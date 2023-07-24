import { IconGripVertical } from '@tabler/icons'
import { Card } from 'primereact/card'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useProjectStore } from '@/components/Custom/Projects/projectStore'

const ProjectColumnItem = ({ item }) => {
    const setSelectedProjectItem = useProjectStore(
        state => state.setSelectedItem,
    )
    const setModalVisibility = useProjectStore(
        state => state.setModalVisibility,
    )

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    const handleCardClick = i => {
        setSelectedProjectItem({
            id: i.id,
            title: i.title,
            status: i.status,
            description: i.description,
        })
        setModalVisibility(true)
    }

    return (
        <>
            <Card
                ref={setNodeRef}
                className="cursor-pointer select-none my-2 border-round-xl surface-hover"
                style={style}
                {...listeners}
                {...attributes}
                onClick={() => handleCardClick(item)}>
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
                    </div>
                </div>
            </Card>
        </>
    )
}

export default ProjectColumnItem
