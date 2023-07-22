import { Card } from 'primereact/card'
import { useDroppable } from '@dnd-kit/core'
import ProjectColumnItem from './ProjectColumnItem'

export default function ProjectColumn({ title, statusId, items }) {
    const { setNodeRef } = useDroppable({
        id: statusId,
    })
    const style = {}

    return (
        <Card
            className="w-28rem h-full border-round-xl surface-card"
            title={title}
            subTitle={<div>+ Add New</div>}
            ref={setNodeRef}
            style={style}>
            {items?.map((item, index) => (
                <ProjectColumnItem key={statusId + '_' + index} item={item} />
            ))}
        </Card>
    )
}
