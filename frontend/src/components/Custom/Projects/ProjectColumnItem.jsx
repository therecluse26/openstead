import { IconGripVertical } from '@tabler/icons'
import { Card } from 'primereact/card'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const ProjectColumnItem = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }
    return (
        <Card
            ref={setNodeRef}
            className="my-2 border-round-xl surface-hover"
            style={style}
            {...listeners}
            {...attributes}>
            <div className="grid grid-cols-2 align-items-center">
                <div className="col-2 align-items-center ">
                    <div className="cursor-pointer w-2rem">
                        <div className="hover:bg-primary p-2 align-items-center transition-colors transition-duration-200 border-round-md">
                            <IconGripVertical size="1rem" />
                        </div>
                    </div>
                </div>
                <div className="col-10 align-items-center">{item.title}</div>
            </div>
        </Card>
    )
}

export default ProjectColumnItem
