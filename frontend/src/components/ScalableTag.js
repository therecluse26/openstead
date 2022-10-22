import { Tag } from 'primereact/tag'
import React from 'react'

const getBadgeSeverity = condition => {
    switch (condition) {
        case 1:
            return 'danger'
        case 2:
            return 'warning'
        case 3:
            return 'info'
        case 4:
            return 'primary'
        case 5:
            return 'success'
    }
}

const ScalableTag = ({ condition, text, fontSize = '.875rem' }) => {
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
