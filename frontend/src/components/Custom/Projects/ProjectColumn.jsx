import { Card } from 'primereact/card'

export default function ProjectColumn({ title, statusId, columnData, items }) {
    return (
        <Card
            className="w-28rem h-full"
            rounded
            title={title}
            subTitle={<div>+ Add new</div>}>
            {items
                .filter(item => {
                    return item.status.id === statusId
                })
                .map((item, index) => (
                    <Card
                        className="bg-primary-900 my-2"
                        key={statusId + '_' + index}>
                        {item.title}
                    </Card>
                ))}
        </Card>
    )
}
