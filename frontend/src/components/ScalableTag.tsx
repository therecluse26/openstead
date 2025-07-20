import React from 'react'
import { Tag } from 'primereact/tag'

type TagSeverity = 'danger' | 'warning' | 'info' | 'success'

type ScalableTagProps = {
    condition: number | TagSeverity
    text: string
    fontSize?: string
}

const getBadgeSeverity = (condition: number): TagSeverity => {
    switch (condition) {
        case 1:
            return 'danger'
        case 2:
            return 'warning'
        case 3:
            return 'info'
        case 4:
            return 'info' // Changed from 'primary' to 'info' since 'primary' is not supported
        case 5:
            return 'success'
        default:
            return 'info'
    }
}

const ScalableTag: React.FC<ScalableTagProps> = ({
    condition,
    text,
    fontSize = '.875rem',
}) => {
    return (
        <Tag
            className="mr-2"
            severity={
                typeof condition === 'number'
                    ? getBadgeSeverity(condition)
                    : condition
            }
            value={text}
            style={{ fontSize: fontSize }}
        />
    )
}

export default ScalableTag
